export const S3_BUCKET_URL = "https://vox-ai-studio.s3.us-east-1.amazonaws.com";

// Shared result shape for all engines
export interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  projectId?: string;
  error?: string;
}

// Chatterbox-specific options
export interface ChatterboxOptions {
  text: string;
  language: string;
  voice_S3_key: string;
  exaggeration?: number;
  cfg_weight?: number;
}

// Gemini-specific options
export interface GeminiOptions {
  text: string;
  voice_name: string;
  gemini_model?: "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts";
  gemini_emotion?: string;
  gemini_style?: string;
  gemini_pace?: string;
}

// Union — what tts.ts accepts
export type TTSOptions = ChatterboxOptions | GeminiOptions;

// Every provider must implement this
export interface TTSProvider {
  generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult>;
  calculateExactPoints(charCount: number): number;
  getName(): string;
}
