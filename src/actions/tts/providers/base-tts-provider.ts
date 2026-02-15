export interface TTSProvider {
  generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult>;
  calculateExactPoints(charCount: number): number;
  getName(): string;
}

export const S3_BUCKET_URL = "https://vox-ai-studio.s3.us-east-1.amazonaws.com";

export interface TTSOptions {
  text: string;
  voice_S3_key: string;
  language: string;
  exaggeration?: number;
  cfg_weight?: number;
}

export interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  projectId?: string;
  error?: string;
}
