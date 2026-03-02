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
import { GoogleGenAI, Modality } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { uploadGeneratedAudio } from "./s3-upload-helper";
import { calcGeminiTTSCredits } from "~/lib/credits/calculate";
import { buildTTSPrompt } from "~/lib/tts/prompt-builder";
import { encodeWav } from "~/lib/audio/wav-encoder";

export class GeminiProvider implements TTSProvider {
  getCredits(options: TTSOptions): number {
    const o = options as GeminiRequestOptions;
    return calcGeminiTTSCredits(o.text?.length ?? 0, o.gemini_model);
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

      // 3. Check credits (model-aware)
      const model = options.gemini_model ?? "gemini-2.5-flash-preview-tts";
      const creditsNeeded = this.getCredits(options);

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
          error: `Insufficient credits. Need ${creditsNeeded}, have ${String(user.credits)}`,
        };
      }

      // 4. Build prompt
      const finalText = buildTTSPrompt(
        options.text,
        options.gemini_emotion,
        options.gemini_style,
        options.gemini_pace,
      );

      // 5. Call Gemini TTS
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: finalText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
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
      const wavBuffer = encodeWav([new Uint8Array(pcmBuffer)]);
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
          language: "autodetect",
          engine: options.gemini_model ?? "gemini-2.5-flash-preview-tts",
          geminiVoice: options.voice_name ?? null,
          geminiEmotion: options.gemini_emotion ?? null,
          geminiStyle: options.gemini_style ?? null,
          geminiPace: options.gemini_pace ?? null,
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
