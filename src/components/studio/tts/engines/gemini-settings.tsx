"use client";

import {
  Cpu,
  Smile,
  Volume2,
  Timer,
  Mic2,
  Info,
  Globe,
  Lock,
} from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  SupportedLanguages,
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
import { useTranslations } from "next-intl";

interface GeminiSettingsProps {
  options: GeminiOptions;
  setOptions: (options: GeminiOptions) => void;
  isTrialTier?: boolean;
}

export default function GeminiSettings({
  options,
  setOptions,
  isTrialTier = false,
}: GeminiSettingsProps) {
  const t = useTranslations("studio.tts.gemini");
  const isPro = options.model === "gemini-2.5-pro-preview-tts";

  return (
    <div className="space-y-4">
      {/* Language */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Globe className="h-3 w-3" /> {t("language")}
        </Label>
        <Select
          value={options.language}
          onValueChange={(value) => setOptions({ ...options, language: value })}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto" className="text-xs">
              {t("autoDetect")}
            </SelectItem>
            {SupportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code} className="text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className={`fi fi-${lang.countryCode} shrink-0`}
                    style={{ fontSize: "1rem" }}
                  />
                  {lang.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Toggle */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Cpu className="h-3 w-3" /> {t("model")}
          <Popover>
            <PopoverTrigger asChild>
              <span className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer transition-colors">
                <Info className="h-3.5 w-3.5" />
              </span>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64 p-3" sideOffset={6}>
              <p className="text-foreground mb-2 text-xs font-semibold">
                {t("flashVsPro")}
              </p>
              <div className="space-y-2">
                <div className="bg-muted rounded-md p-2">
                  <p className="text-foreground text-xs font-medium">
                    {t("flash")}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {CREDITS_PER_CHAR.geminiFlashTTS} {t("flashDesc")}
                  </p>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <p className="text-foreground text-xs font-medium">
                    {t("pro")}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {CREDITS_PER_CHAR.geminiProTTS} {t("proDesc")}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                  isTrialTier ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold">
                    {isPro ? t("proLabel") : t("flashLabel")}
                    {isTrialTier && <Lock className="h-3 w-3 text-amber-500" />}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isPro ? t("proSubLabel") : t("flashSubLabel")}
                    <br />
                    {isPro
                      ? `(${CREDITS_PER_CHAR.geminiProTTS} ${t("creditsPerChar")})`
                      : `(${CREDITS_PER_CHAR.geminiFlashTTS} ${t("creditsPerChar")})`}
                    {isTrialTier && (
                      <span className="ml-1 text-amber-600">
                        {t("freeTrial")}
                      </span>
                    )}
                  </p>
                </div>
                <Switch
                  checked={isPro}
                  disabled={isTrialTier}
                  onCheckedChange={(checked) => {
                    if (isTrialTier) return;
                    setOptions({
                      ...options,
                      model: checked
                        ? "gemini-2.5-pro-preview-tts"
                        : "gemini-2.5-flash-preview-tts",
                    });
                  }}
                />
              </div>
            </TooltipTrigger>
            {isTrialTier && (
              <TooltipContent
                side="right"
                className="max-w-[200px] text-center text-xs"
              >
                {t("proLocked")}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Emotion */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Smile className="h-3 w-3" /> {t("emotion")}
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

      {/* Voice */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-medium">
          <Mic2 className="h-3 w-3" /> {t("voice")}
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
          <Volume2 className="h-3 w-3" /> {t("style")}
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
          <Timer className="h-3 w-3" /> {t("pace")}
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
