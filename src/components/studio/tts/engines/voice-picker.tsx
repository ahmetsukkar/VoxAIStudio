/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useState, useRef } from "react";
import { Check, ChevronDown, Play, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { GeminiVoices } from "~/data/GeminiOptions";
import { cn } from "~/lib/utils";

interface VoicePickerProps {
  value: string;
  onChange: (voice: string) => void;
}

export default function VoicePicker({ value, onChange }: VoicePickerProps) {
  const [open, setOpen]               = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef                      = useRef<HTMLAudioElement | null>(null);

  const selectedVoice = GeminiVoices.find((v) => v.name === value) ?? GeminiVoices[0]!;

  const handlePlay = (e: React.MouseEvent, voice: typeof GeminiVoices[0]) => {
    e.stopPropagation(); // don't select the voice when clicking play

    // If already playing this voice — stop it
    if (playingVoice === voice.name) {
      audioRef.current?.pause();
      setPlayingVoice(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play new sample
    const audio = new Audio(voice.sampleUrl);
    audioRef.current = audio;
    setPlayingVoice(voice.name);

    audio.play().catch(() => setPlayingVoice(null));
    audio.onended = () => setPlayingVoice(null);
  };

  const handleSelect = (voiceName: string) => {
    // Stop preview if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingVoice(null);
    }
    onChange(voiceName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(o) => {
      if (!o && audioRef.current) {
        audioRef.current.pause();
        setPlayingVoice(null);
      }
      setOpen(o);
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between text-xs font-normal"
        >
          <span>
            🎙️ {selectedVoice.name}
            <span className="text-muted-foreground ml-1">— {selectedVoice.description}</span>
          </span>
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-2" align="start">
        <p className="text-muted-foreground mb-2 px-1 text-xs font-medium">
          Select a voice — click ▶ to preview
        </p>
        <div className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto">
          {GeminiVoices.map((voice) => {
            const isSelected = voice.name === value;
            const isPlaying  = playingVoice === voice.name;

            return (
              <div
                key={voice.name}
                onClick={() => handleSelect(voice.name)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md border px-2 py-1.5 text-xs transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-muted border-transparent",
                )}
              >
                {/* Left: name + description */}
                <div className="flex flex-col">
                  <span className="flex items-center gap-1 font-medium">
                    {isSelected && <Check className="h-3 w-3 text-blue-500" />}
                    {voice.name}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {voice.description}
                  </span>
                </div>

                {/* Right: play button */}
                <button
                  onClick={(e) => handlePlay(e, voice)}
                  className={cn(
                    "ml-1 rounded p-1 transition-colors",
                    isPlaying
                      ? "text-blue-500 hover:text-blue-600"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title={isPlaying ? "Stop preview" : "Preview voice"}
                >
                  {isPlaying ? (
                    <Square className="h-3 w-3 fill-current" />
                  ) : (
                    <Play className="h-3 w-3 fill-current" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
