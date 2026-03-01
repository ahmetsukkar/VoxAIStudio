"use client";

import { useState, useRef } from "react";
import { Check, ChevronDown, Play, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { GeminiVoices, type GeminiVoiceCategory } from "~/data/GeminiOptions";
import { cn } from "~/lib/utils";

interface VoicePickerProps {
  value: string;
  onChange: (voice: string) => void;
}

type FilterTab = "All" | GeminiVoiceCategory;

const FILTER_TABS: FilterTab[] = ["All", "Male", "Female"];

const categoryColors: Record<GeminiVoiceCategory, string> = {
  Male:   "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Female: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
};

export default function VoicePicker({ value, onChange }: VoicePickerProps) {
  const [open, setOpen]                 = useState(false);
  const [filter, setFilter]             = useState<FilterTab>("All");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef                        = useRef<HTMLAudioElement | null>(null);

  const selectedVoice = GeminiVoices.find((v) => v.name === value) ?? GeminiVoices[0]!;

  const filteredVoices = filter === "All"
    ? GeminiVoices
    : GeminiVoices.filter((v) => v.category === filter);

  const stopAudio = () => {
    audioRef.current?.pause();
    setPlayingVoice(null);
  };

  const handlePlay = (
    e: React.MouseEvent,
    voice: (typeof GeminiVoices)[0],
  ) => {
    e.stopPropagation();

    if (playingVoice === voice.name) {
      stopAudio();
      return;
    }

    stopAudio();

    const audio = new Audio(voice.sampleUrl);
    audioRef.current = audio;
    setPlayingVoice(voice.name);
    audio.play().catch(() => setPlayingVoice(null));
    audio.onended = () => setPlayingVoice(null);
  };

  const handleSelect = (voiceName: string) => {
    stopAudio();
    onChange(voiceName);
    setOpen(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) stopAudio();
    setOpen(o);
  };

  const isSelectedPlaying = playingVoice === selectedVoice.name;

  return (
    <div className="flex items-center gap-2">
      {/* Dropdown trigger */}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="flex-1 justify-between text-xs font-normal"
          >
            <span className="flex items-center gap-1.5">
              🎙️
              <span className="font-medium">{selectedVoice.name}</span>
              <span className="text-muted-foreground">— {selectedVoice.description}</span>
              <span
                className={cn(
                  "rounded px-1 py-0.5 text-[10px] font-medium",
                  categoryColors[selectedVoice.category],
                )}
              >
                {selectedVoice.category}
              </span>
            </span>
            <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-2" align="start">
          {/* Filter tabs */}
          <div className="mb-2 flex gap-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  filter === tab
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
            <span className="text-muted-foreground ml-auto self-center text-[10px]">
              {filteredVoices.length} voices
            </span>
          </div>

          {/* Voice list */}
          <div className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto">
            {filteredVoices.map((voice) => {
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
                      : "border-transparent hover:bg-muted",
                  )}
                >
                  {/* Left: name + description + category */}
                  <div className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1 font-medium">
                      {isSelected && <Check className="h-3 w-3 shrink-0 text-blue-500" />}
                      <span className="truncate">{voice.name}</span>
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {voice.description}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 w-fit rounded px-1 py-0.5 text-[9px] font-medium",
                        categoryColors[voice.category],
                      )}
                    >
                      {voice.category}
                    </span>
                  </div>

                  {/* Right: play button */}
                  <button
                    onClick={(e) => handlePlay(e, voice)}
                    className={cn(
                      "ml-1 shrink-0 rounded p-1 transition-colors",
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

      {/* Play button outside — preview selected voice without opening dropdown */}
      <button
        onClick={(e) => handlePlay(e, selectedVoice)}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
          isSelectedPlaying
            ? "border-blue-500 bg-blue-50 text-blue-500 dark:bg-blue-950"
            : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        title={isSelectedPlaying ? "Stop preview" : `Preview ${selectedVoice.name}`}
      >
        {isSelectedPlaying ? (
          <Square className="h-3 w-3 fill-current" />
        ) : (
          <Play className="h-3 w-3 fill-current" />
        )}
      </button>
    </div>
  );
}
