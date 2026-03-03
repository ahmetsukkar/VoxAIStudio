import {
  S3_BUCKET_URL,
  type GenerateSpeechResult,
  type ChatterboxRequestOptions,
  type TTSProvider,
  type TTSOptions,
} from "./base-tts-provider";
import { env } from "~/env";
import { calcChatterboxCredits } from "~/lib/credits/calculate";

export class ChatterboxProvider implements TTSProvider {
  getCredits(options: TTSOptions): number {
    const o = options as ChatterboxRequestOptions;
    return calcChatterboxCredits(o.text?.length ?? 0);
  }

  async generateSpeech(data: TTSOptions): Promise<GenerateSpeechResult> {
    const options = data as ChatterboxRequestOptions;

    if (!options.text || !options.voice_S3_key || !options.language) {
      return { success: false, error: "Missing required fields" };
    }

    const response = await fetch(env.MODAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Modal-Key": env.MODAL_API_KEY,
        "Modal-Secret": env.MODAL_API_SECRET,
      },
      body: JSON.stringify({
        text: options.text,
        voice_S3_key: options.voice_S3_key,
        language: options.language,
        exaggeration: options.exaggeration ?? 0.5,
        cfg_weight: options.cfg_weight ?? 0.5,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to generate speech" };
    }

    const result = (await response.json()) as { s3_Key: string };
    const audioUrl = `${S3_BUCKET_URL}/${result.s3_Key}`;

    return { success: true, s3_key: result.s3_Key, audioUrl };
  }

  getName(): string { return "chatterbox"; }
}
