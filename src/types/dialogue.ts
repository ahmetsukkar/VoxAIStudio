import type { GeminiEmotion, GeminiStyle, GeminiPace, GeminiModel } from "~/data/GeminiOptions";

export interface DialogueSpeaker {
  id: "s1" | "s2";
  name: string;           // editable, default "John" / "Mary"
  voice: string;          // from GeminiVoices
  color: "blue" | "green"; // fixed per speaker, for avatar
}

export interface DialogueLine {
  id: string;
  speakerId: "s1" | "s2";
  text: string;
  emotion: GeminiEmotion; // per-line, default "neutral"
}

export interface DialogueSettings {
  model: GeminiModel;     // Flash/Pro toggle
  style: GeminiStyle;
  pace: GeminiPace;
  reverb: boolean;        // toggle on/off
}
