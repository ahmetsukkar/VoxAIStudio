import type { TTSProvider } from "./providers/base-tts-provider";
import { GeminiProvider } from "./providers/gemini-Provider";
import { GoogleCloudProvider } from "./providers/googleCloud-Provider";


export type TTSProviderType = 'googleCloud' | 'gemini';

export class TTSFactory {
  static getProvider(providerType: TTSProviderType): TTSProvider {
    switch (providerType) {
      case 'googleCloud':
        return new GoogleCloudProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        throw new Error(`Unknown TTS provider: ${providerType}`);
    }
  }
}