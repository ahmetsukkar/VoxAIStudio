"use client";

import { Cpu, Smile, Volume2, Timer, Mic2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  GeminiEmotions,
  GeminiStyles,
  GeminiPaces,
  type GeminiEmotion,
  type GeminiStyle,
  type GeminiPace,
} from "~/data/GeminiOptions";
import type { GeminiOptions } from "~/types/engines";
import VoicePicker from "./voice-picker";
import { CREDITS_PER_CHAR } from "~/config/credits";

interface GeminiSettingsProps {
  options: GeminiOptions;
  setOptions: (options: GeminiOptions) => void;
}

export default function GeminiSettings({
  options,
  setOptions,
}: GeminiSettingsProps) {
  const isPro = options.model === "gemini-2.5-pro-preview-tts";

  return (
    <div className="space-y-4">

      {/* Model Toggle — Flash / Pro */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Cpu className="h-3 w-3" /> Model
        </Label>
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              {isPro ? "Pro — Highest Quality" : "Flash — Fast & Affordable"}
            </span>
            <span className="text-muted-foreground text-[10px]">
              {isPro
                ? `${CREDITS_PER_CHAR.geminiProTTS} credits / char`
                : `${CREDITS_PER_CHAR.geminiFlashTTS} credits / char`}
            </span>
          </div>
          <Switch
            checked={isPro}
            onCheckedChange={(checked) =>
              setOptions({
                ...options,
                model: checked
                  ? "gemini-2.5-pro-preview-tts"
                  : "gemini-2.5-flash-preview-tts",
              })
            }
          />
        </div>
      </div>

      {/* Voice Picker */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Mic2 className="h-3 w-3" /> Voice
        </Label>
        <VoicePicker
          value={options.voice}
          onChange={(voice) => setOptions({ ...options, voice })}
        />
      </div>

      {/* Emotion */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Smile className="h-3 w-3" /> Emotion
        </Label>
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
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Volume2 className="h-3 w-3" /> Style
        </Label>
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
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Timer className="h-3 w-3" /> Pace
        </Label>
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
          Language is auto-detected from your text.
        </p>
      </div>

    </div>
  );
}
