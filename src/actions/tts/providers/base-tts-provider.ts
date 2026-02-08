export interface TTSProvider {
  generateSpeech(text: string, options: TTSOptions): Promise<AudioResult>;
  getName(): string;
}

export interface TTSOptions {
  voice?: string;
  speed?: number;
  language?: string;
  // Add common options
}

export interface AudioResult {
  audioUrl: string;
  duration: number;
  provider: string;
}