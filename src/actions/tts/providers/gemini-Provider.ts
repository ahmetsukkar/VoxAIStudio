/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type {
  GenerateSpeechResult,
  GeminiRequestOptions,
  TTSOptions,
  TTSProvider,
} from "./base-tts-provider";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { env } from "~/env";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { uploadGeneratedAudio } from "./s3-upload-helper";
import type { GeminiEmotion, GeminiStyle, GeminiPace } from "~/data/GeminiOptions";

function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  channels = 1,
  bitDepth = 16,
): Buffer {
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * (bitDepth / 8), 28);
  header.writeUInt16LE(channels * (bitDepth / 8), 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

function getEmotionInstruction(emotion: GeminiEmotion): string {
  switch (emotion) {
    case "whispering": return "Speak in a very quiet, breathy whisper. Very low energy.";
    case "sad":        return "Speak in a slow, mournful, and sad tone.";
    case "cheerful":   return "Speak in a very happy, bright, and smiling tone.";
    case "angry":      return "Speak in a sharp, loud, and aggressive angry tone.";
    case "excited":    return "Speak with high energy and enthusiasm.";
    case "emotional":  return "Speak with deep feeling and emotional resonance.";
    default:           return "Speak in a natural, neutral tone.";
  }
}

function getStyleInstruction(style: GeminiStyle): string {
  switch (style) {
    case "newsreader":       return "Deliver in a clear, authoritative news reader style.";
    case "storytelling":     return "Use a warm, engaging storytelling tone with natural rhythm.";
    case "podcast":          return "Sound like a relaxed, friendly podcast host.";
    case "audiobook":        return "Read clearly and expressively like a professional audiobook narrator.";
    case "customer-support": return "Use a calm, helpful, and professional customer support tone.";
    default:                 return "Use a natural, conversational delivery.";
  }
}

function getPaceInstruction(pace: GeminiPace): string {
  switch (pace) {
    case "slow": return "Speak slowly and deliberately.";
    case "fast": return "Speak at a fast, energetic pace.";
    default:     return "Speak at a normal, natural pace.";
  }
}

function buildPrompt(
  text: string,
  emotion: GeminiEmotion = "neutral",
  style: GeminiStyle = "conversational",
  pace: GeminiPace = "normal",
): string {
  const emotionInstruction = getEmotionInstruction(emotion);
  const styleInstruction   = getStyleInstruction(style);
  const paceInstruction    = getPaceInstruction(pace);
  return `${emotionInstruction} ${styleInstruction} ${paceInstruction}\n\nText: ${text}`;
}
export class GeminiProvider implements TTSProvider {
  calculateExactPoints(charCount: number): number {
    return (5 / 1000) * charCount;
  }

  async generateSpeech(data: TTSOptions): Promise<GenerateSpeechResult> {
    const options = data as GeminiRequestOptions;

    try {
      // 1. Auth check
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
      }

      // 2. Validate
      if (!options.text) {
        return { success: false, error: "Text is required" };
      }

      // 3. Check credits
      const creditsNeeded = this.calculateExactPoints(options.text.length);
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      if (Number(user.credits) < creditsNeeded) {
        return {
          success: false,
          error: `Insufficient credits. Need ${creditsNeeded.toFixed(2)}, have ${user.credits}`,
        };
      }

      // 4. Build the full prompt with emotion + style + pace instructions
      const finalText = buildPrompt(
        options.text,
        options.gemini_emotion as GeminiEmotion,
        options.gemini_style as GeminiStyle,
        options.gemini_pace as GeminiPace,
      );

      // 5. Call Gemini TTS
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: options.gemini_model ?? "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: finalText }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: options.voice_name ?? "Kore",
              },
            },
          },
        },
      });

      // 6. Extract base64 PCM audio
      const rawBase64 =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!rawBase64) {
        return { success: false, error: "No audio data returned from Gemini" };
      }

      // 7. Convert PCM → WAV and upload to S3
      const pcmBuffer = Buffer.from(rawBase64, "base64");
      const wavBuffer = pcmToWav(pcmBuffer);
      const s3Key = `generated/gemini/${uuidv4()}.wav`;
      const audioUrl = await uploadGeneratedAudio(wavBuffer, s3Key);

      // 8. Deduct credits
      await db.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: creditsNeeded } },
      });

      // 9. Save to DB
      const audioProject = await db.audioProject.create({
        data: {
          text: options.text,
          audioUrl,
          s3Key,
          language: "multilingual",
          voiceS3Key: options.voice_name,
          engine: "gemini",
          userId: session.user.id,
        },
      });

      return {
        success: true,
        s3_key: s3Key,
        audioUrl,
        projectId: audioProject.id,
      };

    } catch (error) {
      console.error("Gemini TTS error:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  getName(): string {
    return "gemini";
  }
}
