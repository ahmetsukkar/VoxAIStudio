import { env } from "~/env";

export const S3_BUCKET_URL = env.R2_PUBLIC_URL;

import type {
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

export interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  error?: string;
  promptTokens?: number;
  audioTokens?: number;
}

export interface GenerateSpeechFinalResult extends GenerateSpeechResult {
  projectId?: string;
  creditsRemaining?: number;
}

// Gemini-specific options
export interface GeminiRequestOptions {
  text: string;
  voice_name: string;
  gemini_model?: GeminiModel;
  gemini_emotion?: GeminiEmotion;
  gemini_style?: GeminiStyle;
  gemini_pace?: GeminiPace;
  gemini_language?: string;
}

export type TTSOptions = GeminiRequestOptions;

export interface TTSProvider {
  generateSpeech(options: TTSOptions, apiKey: string): Promise<GenerateSpeechResult>;
  getCredits(options: TTSOptions): number;
  getName(): string;
}
