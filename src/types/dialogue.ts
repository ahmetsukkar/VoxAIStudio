import type {
  GeminiEmotion,
  GeminiStyle,
  GeminiPace,
  GeminiModel,
} from "~/data/GeminiOptions";

export type SpeakerId = "s1" | "s2";

export type SpeakerColor = "blue" | "green";

export const speakerColors: Record<
  SpeakerColor,
  { bg: string; border: string }
> = {
  blue: { bg: "bg-blue-500", border: "border-blue-500" },
  green: { bg: "bg-green-500", border: "border-green-500" },
};

export interface DialogueSpeaker {
  id: SpeakerId;
  name: string;
  voice: string;
  color: SpeakerColor;
  emotion: GeminiEmotion;
}

export interface DialogueLine {
  id: string;
  speakerId: SpeakerId;
  text: string;
}

export interface DialogueSettings {
  model: GeminiModel;
  style: GeminiStyle;
  pace: GeminiPace;
  language: string;   // "auto" or BCP-47 code
}
