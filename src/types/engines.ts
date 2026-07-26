import type {
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

export interface GeminiOptions {
  voice: string;
  model: GeminiModel;
  emotion: GeminiEmotion;
  style: GeminiStyle;
  pace: GeminiPace;
  language: string; // "auto" or BCP-47 code
}

export interface EngineOptionsMap {
  gemini: GeminiOptions;
}
