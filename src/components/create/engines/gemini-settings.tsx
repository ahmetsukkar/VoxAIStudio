"use client";

import { Volume2, Cpu, Smile, Mic2, Timer } from "lucide-react";
import {
  GeminiVoices,
  GeminiEmotions,
  GeminiStyles,
  GeminiPaces,
  type GeminiEmotion,
  type GeminiStyle,
  type GeminiPace,
  type GeminiModel,
} from "~/data/GeminiOptions";

interface GeminiSettingsProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
  geminiEmotion: GeminiEmotion;
  setGeminiEmotion: (emotion: GeminiEmotion) => void;
  geminiStyle: GeminiStyle;
  setGeminiStyle: (style: GeminiStyle) => void;
  geminiPace: GeminiPace;
  setGeminiPace: (pace: GeminiPace) => void;
}

export default function GeminiSettings({
  selectedVoice,
  setSelectedVoice,
  geminiModel,
  setGeminiModel,
  geminiEmotion,
  setGeminiEmotion,
  geminiStyle,
  setGeminiStyle,
  geminiPace,
  setGeminiPace,
}: GeminiSettingsProps) {
  return (
    <div className="space-y-4">

      {/* Model */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Cpu className="h-3 w-3" /> Model
        </label>
        <select
          value={geminiModel}
          onChange={(e) => setGeminiModel(e.target.value as GeminiModel)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          <option value="gemini-2.5-flash-preview-tts">
            Gemini 2.5 Flash — Fast & Affordable
          </option>
          <option value="gemini-2.5-pro-preview-tts">
            Gemini 2.5 Pro — Highest Quality
          </option>
        </select>
      </div>

      {/* Voice */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Volume2 className="h-3 w-3" /> Voice
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {GeminiVoices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} — {voice.description}
            </option>
          ))}
        </select>
      </div>

      {/* Emotion */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Smile className="h-3 w-3" /> Emotion
        </label>
        <select
          value={geminiEmotion}
          onChange={(e) => setGeminiEmotion(e.target.value as GeminiEmotion)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {GeminiEmotions.map((emotion) => (
            <option key={emotion.value} value={emotion.value}>
              {emotion.label}
            </option>
          ))}
        </select>
      </div>
      {/* Style */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Mic2 className="h-3 w-3" /> Style
        </label>
        <select
          value={geminiStyle}
          onChange={(e) => setGeminiStyle(e.target.value as GeminiStyle)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {GeminiStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pace */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Timer className="h-3 w-3" /> Pace
        </label>
        <select
          value={geminiPace}
          onChange={(e) => setGeminiPace(e.target.value as GeminiPace)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {GeminiPaces.map((pace) => (
            <option key={pace.value} value={pace.value}>
              {pace.label}
            </option>
          ))}
        </select>
      </div>

      {/* Info box */}
      <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700">
        <p className="font-medium">Gemini TTS</p>
        <p className="mt-1">
          Language is auto-detected from your text. Costs 5 credits per 1,000 characters.
        </p>
      </div>

    </div>
  );
}
