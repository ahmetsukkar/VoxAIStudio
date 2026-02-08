import type { AudioResult, TTSOptions, TTSProvider } from "./base-tts-provider";

export class GeminiProvider implements TTSProvider {
  async generateSpeech(text: string, options: TTSOptions): Promise<AudioResult> {
    // GeminiProvider-specific implementation
    throw new Error('Not implemented');
  }
  getName(): string { return 'gemini'; }
}