export const S3_BUCKET_URL = "https://vox-ai-studio.s3.us-east-1.amazonaws.com";

import type {
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

// Shared result shape for all engines
export interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  projectId?: string;
  error?: string;
}

// Chatterbox-specific options
export interface ChatterboxRequestOptions {
  text: string;
  language: string;
  voice_S3_key: string;
  exaggeration?: number;
  cfg_weight?: number;
}

// Gemini-specific options
export interface GeminiRequestOptions {
  text: string;
  voice_name: string;
  gemini_model?: GeminiModel;
  gemini_emotion?: GeminiEmotion;
  gemini_style?: GeminiStyle;
  gemini_pace?: GeminiPace;
}

// Union — what tts.ts accepts
export type TTSOptions = ChatterboxRequestOptions | GeminiRequestOptions;

// Every provider must implement this
export interface TTSProvider {
  generateSpeech(options: TTSOptions): Promise<GenerateSpeechResult>;
  getCredits(options: TTSOptions): number;
  getName(): string;
}
