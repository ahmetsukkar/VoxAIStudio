import type {
  GenerateSpeechResult,
  TTSOptions,
  TTSProvider,
} from "./base-tts-provider";
import { env } from "~/env";
import { GoogleGenAI, Modality } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { uploadGeneratedAudio } from "./s3-upload-helper";
import type { GeminiModel } from "~/data/GeminiOptions";
import { calcGeminiTTSCredits } from "~/lib/credits/calculate";
import { buildTTSPrompt } from "~/lib/tts/prompt-builder";
import { encodeWav } from "~/lib/audio/wav-encoder";

export class GeminiProvider implements TTSProvider {
  getCredits(options: TTSOptions): number {
    return calcGeminiTTSCredits(options.text?.length ?? 0, options.gemini_model);
  }

  async generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult> {
    if (!options.text) {
      return { success: false, error: "Text is required" };
    }

    const model: GeminiModel = options.gemini_model ?? "gemini-2.5-flash-preview-tts";

    const finalText = buildTTSPrompt(
      options.text,
      options.gemini_emotion,
      options.gemini_style,
      options.gemini_pace,
    );

    const ai = new GoogleGenAI({ apiKey: env.GenerativeLanguageAPIKey });

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: finalText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: options.voice_name ?? "Kore" },
          },
        },
      },
    });

    const rawBase64 =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!rawBase64) {
      return { success: false, error: "No audio data returned from Gemini" };
    }

    const pcmBuffer = Buffer.from(rawBase64, "base64");
    const wavBuffer = encodeWav([new Uint8Array(pcmBuffer)]);
    const s3Key     = `generated/gemini/${uuidv4()}.wav`;
    const audioUrl  = await uploadGeneratedAudio(wavBuffer, s3Key);

    return { success: true, s3_key: s3Key, audioUrl };
  }

  getName(): string { return "gemini"; }
}
