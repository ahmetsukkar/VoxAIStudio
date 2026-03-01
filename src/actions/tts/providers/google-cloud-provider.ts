import { CREDITS_PER_CHAR } from "~/config/credits";
import type { ChatterboxRequestOptions, GenerateSpeechResult, TTSOptions, TTSProvider } from "./base-tts-provider";

export class GoogleCloudProvider implements TTSProvider {
  getCredits(options: TTSOptions): number {
    const o = options as ChatterboxRequestOptions;
    return (o.text?.length ?? 0) * CREDITS_PER_CHAR.chatterbox;
  }
  async generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult> {
    // googleCloud-specific implementation
    throw new Error('Not implemented');
  }
  getName(): string { return 'googleCloud'; }
}