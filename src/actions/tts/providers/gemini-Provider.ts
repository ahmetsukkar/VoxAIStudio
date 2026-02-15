import type { GenerateSpeechResult, TTSOptions, TTSProvider } from "./base-tts-provider";

export class GeminiProvider implements TTSProvider {
  calculateExactPoints(charCount: number): number {
    return (5 / 1000) * charCount;
  }
  async generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult> {
    // GeminiProvider-specific implementation
    throw new Error('Not implemented');
  }
  getName(): string { return 'gemini'; }
}