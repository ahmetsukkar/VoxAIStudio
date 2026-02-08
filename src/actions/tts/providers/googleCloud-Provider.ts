import type { AudioResult, TTSOptions, TTSProvider } from "./base-tts-provider";

export class GoogleCloudProvider implements TTSProvider {
  async generateSpeech(text: string, options: TTSOptions): Promise<AudioResult> {
    // googleCloud-specific implementation
    throw new Error('Not implemented');
  }
  getName(): string { return 'googleCloud'; }
}