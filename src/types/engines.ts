import type {
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

export interface ChatterboxOptions {
  language: string;
  voice: string;
  exaggeration: number;
  cfgWeight: number;
}

export interface GeminiOptions {
  voice: string;
  model: GeminiModel;
  emotion: GeminiEmotion;
  style: GeminiStyle;
  pace: GeminiPace;
}

export interface EngineOptionsMap {
  chatterbox: ChatterboxOptions;
  gemini: GeminiOptions;
}
