"use client";

import { useState, useRef } from "react";
import { Check, ChevronDown, Play, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  GeminiVoices,
  GeminiVoiceEmotionMap,
  type GeminiVoiceCategory,
  type GeminiEmotion,
} from "~/data/GeminiOptions";
import { cn } from "~/lib/utils";
import { useTranslations } from "next-intl";

interface VoicePickerProps {
  value: string;
  onChange: (voice: string) => void;
  emotion?: GeminiEmotion;
}

type FilterTab = "All" | "Recommended" | GeminiVoiceCategory;

const categoryColors: Record<GeminiVoiceCategory, string> = {
  Male: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Female: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
};

export default function VoicePicker({
  value,
  onChange,
  emotion,
}: VoicePickerProps) {
  const t = useTranslations("studio.tts.voicePicker");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("All");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedVoice =
    GeminiVoices.find((v) => v.name === value) ?? GeminiVoices[0]!;
  const recommendedNames = emotion
    ? (GeminiVoiceEmotionMap[emotion] ?? [])
    : [];
  const hasRecommendations = recommendedNames.length > 0;

  const sortedVoices = [...GeminiVoices].sort((a, b) => {
    const aRec = recommendedNames.includes(a.name);
    const bRec = recommendedNames.includes(b.name);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  const FILTER_TABS: FilterTab[] = [
    "All",
    ...(hasRecommendations ? (["Recommended"] as FilterTab[]) : []),
    "Male",
    "Female",
  ];

  const filteredVoices = (() => {
    if (filter === "Recommended")
      return sortedVoices.filter((v) => recommendedNames.includes(v.name));
    if (filter === "Male")
      return sortedVoices.filter((v) => v.category === "Male");
    if (filter === "Female")
      return sortedVoices.filter((v) => v.category === "Female");
    return sortedVoices;
  })();

  const stopAudio = () => {
    audioRef.current?.pause();
    setPlayingVoice(null);
  };

  const handlePlay = (e: React.MouseEvent, voice: (typeof GeminiVoices)[0]) => {
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
  const isSelectedRecommended = recommendedNames.includes(selectedVoice.name);

  // Map internal FilterTab value → translated display label
  const tabLabel = (tab: FilterTab) => {
    if (tab === "All") return t("all");
    if (tab === "Recommended") return `⭐ ${t("recommended")}`;
    if (tab === "Male") return t("male");
    if (tab === "Female") return t("female");
    return tab;
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {/* Dropdown trigger */}
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="min-w-0 flex-1 justify-between text-xs font-normal"
            >
              <span className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                🎙️
                <span className="truncate font-medium">
                  {selectedVoice.name}
                </span>
                <span className="text-muted-foreground truncate">
                  — {selectedVoice.description}
                </span>
              </span>
              <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-2" align="start">
            {/* Filter tabs */}
            <div className="mb-2 flex flex-wrap gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    filter === tab
                      ? tab === "Recommended"
                        ? "bg-yellow-400 text-yellow-900"
                        : "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {tabLabel(tab)}
                </button>
              ))}
              <span className="text-muted-foreground ml-auto self-center text-[10px]">
                {filteredVoices.length} {t("voices")}
              </span>
            </div>

            {/* Voice list */}
            <div className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto">
              {filteredVoices.map((voice) => {
                const isSelected = voice.name === value;
                const isPlaying = playingVoice === voice.name;
                const isRecommended = recommendedNames.includes(voice.name);

                return (
                  <div
                    key={voice.name}
                    onClick={() => handleSelect(voice.name)}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-between rounded-md border px-2 py-1.5 text-xs transition-colors",
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : isRecommended
                          ? "border-yellow-300 bg-yellow-50/50 hover:bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30"
                          : "hover:bg-muted border-transparent",
                    )}
                  >
                    {isRecommended && (
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    )}

                    <div className="flex min-w-0 flex-col">
                      <span className="flex items-center gap-1 font-medium">
                        {isSelected && (
                          <Check className="h-3 w-3 shrink-0 text-blue-500" />
                        )}
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
                        {voice.category === "Male" ? t("male") : t("female")}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handlePlay(e, voice)}
                      className={cn(
                        "ml-1 shrink-0 rounded p-1 transition-colors",
                        isPlaying
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      title={isPlaying ? t("stopPreview") : t("previewVoice")}
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

        {/* Preview selected voice button */}
        <button
          onClick={(e) => handlePlay(e, selectedVoice)}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
            isSelectedPlaying
              ? "border-blue-500 bg-blue-50 text-blue-500 dark:bg-blue-950"
              : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          title={
            isSelectedPlaying
              ? t("stopPreview")
              : `${t("previewVoice")} ${selectedVoice.name}`
          }
        >
          {isSelectedPlaying ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Play className="h-3 w-3 fill-current" />
          )}
        </button>
      </div>

      {/* Tip note */}
      {hasRecommendations && emotion && (
        <p className="text-muted-foreground text-[11px]">
          {t("tip")} <span className="font-medium capitalize">{emotion}</span>{" "}
          {t("tipTone")}{" "}
          <span className="text-foreground font-medium">
            {recommendedNames.slice(0, 4).join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}
