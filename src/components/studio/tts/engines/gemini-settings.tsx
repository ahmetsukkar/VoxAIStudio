"use client";

import { Cpu, Smile, Volume2, Timer, Mic2, Info } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
      {/* Model Toggle */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Cpu className="h-3 w-3" /> Model
          <Popover>
            <PopoverTrigger asChild>
              <span className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer transition-colors">
                <Info className="h-3.5 w-3.5" />
              </span>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64 p-3" sideOffset={6}>
              <p className="text-foreground mb-2 text-xs font-semibold">
                Flash vs Pro
              </p>
              <div className="space-y-2">
                <div className="bg-muted rounded-md p-2">
                  <p className="text-foreground text-xs font-medium">
                    ⚡ Flash — Fast & Affordable
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {CREDITS_PER_CHAR.geminiFlashTTS} credits / char · Best for
                    short clips, dialogues, and quick generations.
                  </p>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <p className="text-foreground text-xs font-medium">
                    ✨ Pro — Highest Quality
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {CREDITS_PER_CHAR.geminiProTTS} credits / char · Best for
                    audiobooks, long narrations, and professional content.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Label>

        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold">
              {options.model === "gemini-2.5-flash-preview-tts"
                ? "Flash — Recommended"
                : "Pro — Long-form Content"}
            </p>
            <p className="text-muted-foreground text-xs">
              {isPro
                ? "Better for audiobooks & speeches"
                : "Best for dialogues & short lines"}
              <br />
              {isPro
                ? `(${CREDITS_PER_CHAR.geminiProTTS} credits / char)`
                : `(${CREDITS_PER_CHAR.geminiFlashTTS} credits / char)`}
            </p>
          </div>
          <Switch
            checked={options.model === "gemini-2.5-pro-preview-tts"}
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

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Smile className="h-3 w-3" /> Emotion
        </Label>
        <Select
          value={options.emotion}
          onValueChange={(value) =>
            setOptions({ ...options, emotion: value as GeminiEmotion })
          }
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GeminiEmotions.map((emotion) => (
              <SelectItem
                key={emotion.value}
                value={emotion.value}
                className="text-xs"
              >
                {emotion.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Mic2 className="h-3 w-3" /> Voice
        </Label>
        <VoicePicker
          value={options.voice}
          onChange={(voice) => setOptions({ ...options, voice })}
          emotion={options.emotion} 
        />
      </div>

      {/* Style */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Volume2 className="h-3 w-3" /> Style
        </Label>
        <Select
          value={options.style}
          onValueChange={(value) =>
            setOptions({ ...options, style: value as GeminiStyle })
          }
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GeminiStyles.map((style) => (
              <SelectItem
                key={style.value}
                value={style.value}
                className="text-xs"
              >
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pace */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Timer className="h-3 w-3" /> Pace
        </Label>
        <Select
          value={options.pace}
          onValueChange={(value) =>
            setOptions({ ...options, pace: value as GeminiPace })
          }
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GeminiPaces.map((pace) => (
              <SelectItem
                key={pace.value}
                value={pace.value}
                className="text-xs"
              >
                {pace.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
