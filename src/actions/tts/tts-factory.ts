import type { TTSProvider } from "./providers/base-tts-provider";
import { GeminiProvider } from "./providers/gemini-provider";

export type TTSProviderType = "gemini";

export class TTSFactory {
  static getProvider(providerType: TTSProviderType): TTSProvider {
    switch (providerType) {
      case "gemini":
        return new GeminiProvider();
      default:
        throw new Error(`Unknown TTS provider: ${providerType as string}`);
    }
  }
}
