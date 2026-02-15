import type { GenerateSpeechResult, TTSOptions, TTSProvider } from "./base-tts-provider";

export class GoogleCloudProvider implements TTSProvider {
  calculateExactPoints(charCount: number): number {
    return (5 / 1000) * charCount;
  }
  async generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult> {
    // googleCloud-specific implementation
    throw new Error('Not implemented');
  }
  getName(): string { return 'googleCloud'; }
}