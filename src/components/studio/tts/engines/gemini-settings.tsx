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
import type { GeminiOptions } from "~/types/engines";

interface GeminiSettingsProps {
  options: GeminiOptions;
  setOptions: (options: GeminiOptions) => void;
}

export default function GeminiSettings({
  options,
  setOptions,
}: GeminiSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Model */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Cpu className="h-3 w-3" /> Model
        </label>
        <select
          value={options.model}
          onChange={(e) =>
            setOptions({ ...options, model: e.target.value as GeminiModel })
          }
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          <option value="gemini-2.5-flash-preview-tts">
            Gemini 2.5 Flash — Fast &amp; Affordable
          </option>
          <option value="gemini-2.5-pro-preview-tts">
            Gemini 2.5 Pro — Highest Quality
          </option>
        </select>
      </div>

      {/* Voice */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Mic2 className="h-3 w-3" /> Voice
        </label>
        <select
          value={options.voice}
          onChange={(e) => setOptions({ ...options, voice: e.target.value })}
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
          value={options.emotion}
          onChange={(e) =>
            setOptions({ ...options, emotion: e.target.value as GeminiEmotion })
          }
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
          <Volume2 className="h-3 w-3" /> Style
        </label>
        <select
          value={options.style}
          onChange={(e) =>
            setOptions({ ...options, style: e.target.value as GeminiStyle })
          }
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
          value={options.pace}
          onChange={(e) =>
            setOptions({ ...options, pace: e.target.value as GeminiPace })
          }
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
      <div className="bg-muted rounded-md p-2 text-xs">
        <p className="font-medium">Gemini TTS</p>
        <p className="text-muted-foreground">
          Language is auto-detected from your text. Costs 5 credits per 1,000
          characters.
        </p>
      </div>
    </div>
  );
}
