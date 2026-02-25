import type {
  GeminiEmotion,
  GeminiStyle,
  GeminiPace,
  GeminiModel,
} from "~/data/GeminiOptions";

export type SpeakerId = "s1" | "s2";

export interface DialogueSpeaker {
  id: SpeakerId;
  name: string;
  voice: string;
  color: "blue" | "green";
}

export interface DialogueLine {
  id: string;
  speakerId: SpeakerId;
  text: string;
  emotion: GeminiEmotion;
}

export interface DialogueSettings {
  model: GeminiModel;
  style: GeminiStyle;
  pace: GeminiPace;
  reverb: boolean;
}
