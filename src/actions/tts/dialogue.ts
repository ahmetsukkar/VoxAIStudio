/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { env } from "~/env";
import { uploadGeneratedAudio } from "~/actions/tts/providers/s3-upload-helper";
import { v4 as uuidv4 } from "uuid";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";

function buildPrompt(
  text: string,
  emotion: string,
  style: string,
  pace: string,
): string {
  const emotionMap: Record<string, string> = {
    neutral: "Speak in a natural, neutral tone.",
    cheerful: "Speak in a very happy, bright, and cheerful tone.",
    sad: "Speak in a slow, mournful, and sad tone.",
    angry: "Speak in a sharp, loud, and aggressive angry tone.",
    excited: "Speak with high energy and enthusiasm.",
    whispering: "Speak in a very quiet, breathy whisper.",
    emotional: "Speak with deep feeling and emotional resonance.",
  };

  const styleMap: Record<string, string> = {
    conversational: "Use a natural conversational style.",
    newsreader: "Use a clear, professional news reader style.",
    storytelling: "Use an engaging storytelling style.",
    podcast: "Use a relaxed, podcast hosting style.",
    audiobook: "Use a smooth, audiobook narration style.",
    "customer-support": "Use a friendly, helpful customer support style.",
  };

  const paceMap: Record<string, string> = {
    normal: "Speak at a normal pace.",
    slow: "Speak slowly and clearly.",
    fast: "Speak at a faster pace.",
  };

  return `${emotionMap[emotion] ?? emotionMap.neutral} ${styleMap[style] ?? styleMap.conversational} ${paceMap[pace] ?? paceMap.normal} Text: ${text}`;
}

// ─── WAV encoder ──────────────────────────────────────────────────────────────
function encodeWav(pcmChunks: Uint8Array[]): Buffer {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;

  const totalPcmLength = pcmChunks.reduce((sum, c) => sum + c.byteLength, 0);
  const fileSize = 44 + totalPcmLength;
  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  buffer.write("RIFF", offset);
  offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset);
  offset += 4;
  buffer.write("WAVE", offset);
  offset += 4;
  buffer.write("fmt ", offset);
  offset += 4;
  buffer.writeUInt32LE(16, offset);
  offset += 4;
  buffer.writeUInt16LE(1, offset);
  offset += 2;
  buffer.writeUInt16LE(numChannels, offset);
  offset += 2;
  buffer.writeUInt32LE(sampleRate, offset);
  offset += 4;
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), offset);
  offset += 4;
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), offset);
  offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset);
  offset += 2;
  buffer.write("data", offset);
  offset += 4;
  buffer.writeUInt32LE(totalPcmLength, offset);
  offset += 4;

  for (const chunk of pcmChunks) {
    Buffer.from(chunk).copy(buffer, offset);
    offset += chunk.byteLength;
  }

  return buffer;
}

// ─── Main server action ───────────────────────────────────────────────────────
export async function generateDialogue({
  speakers,
  lines,
  settings,
}: {
  speakers: DialogueSpeaker[];
  lines: DialogueLine[];
  settings: DialogueSettings;
}): Promise<{
  success: boolean;
  audioUrl?: string;
  s3_key?: string;
  error?: string;
}> {
  try {
    // 1. Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate
    const filledLines = lines.filter((l) => l.text.trim().length > 0);
    if (filledLines.length === 0) {
      return {
        success: false,
        error: "Add at least one dialogue line with text.",
      };
    }

    // 3. Credits check
    const creditsNeeded = calcGeminiDialogueCredits(filledLines, settings);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) return { success: false, error: "User not found" };
    if (Number(user.credits) < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.credits}`,
      };
    }

    // 4. Build speaker lookup map
    const speakersMap = Object.fromEntries(speakers.map((s) => [s.id, s]));

    // 5. Generate audio per line, collect PCM chunks
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const pcmChunks: Uint8Array[] = [];

    for (const line of filledLines) {
      const speaker = speakersMap[line.speakerId];
      if (!speaker) continue;

      const prompt = buildPrompt(
        line.text,
        line.emotion,
        settings.style,
        settings.pace,
      );

      const response = await ai.models.generateContent({
        model: settings.model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: speaker.voice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        return {
          success: false,
          error: `No audio returned for line: "${line.text}"`,
        };
      }

      // ✅ Node.js safe — no atob()
      const pcm = new Uint8Array(Buffer.from(base64Audio, "base64"));
      pcmChunks.push(pcm);
    }

    if (pcmChunks.length === 0) {
      return { success: false, error: "No audio was generated." };
    }

    // 6. Encode all PCM chunks into one WAV file
    const wavBuffer = encodeWav(pcmChunks);

    // 7. Upload to S3
    const s3Key = `generated/dialogue/${uuidv4()}.wav`;
    const audioUrl = await uploadGeneratedAudio(wavBuffer, s3Key);

    // 8. Deduct credits
    await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
    });

    // 9. Save to DB
    const fullText = filledLines
      .map((l) => {
        const spk = speakersMap[l.speakerId];
        return `${spk?.name ?? "Speaker"}: ${l.text}`;
      })
      .join("\n");

    await db.audioProject.create({
      data: {
        text: fullText,
        audioUrl,
        s3Key,
        language: "multilingual",
        voiceS3Key: "dialogue",
        engine: "gemini-dialogue",
        userId: session.user.id,
      },
    });

    return { success: true, audioUrl, s3_key: s3Key };
  } catch (error) {
    console.error("Dialogue generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
