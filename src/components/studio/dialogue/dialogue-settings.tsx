"use client";

import { Cpu, Gauge, Info, Mic2, Globe } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  GeminiStyles,
  GeminiPaces,
  SupportedLanguages,
} from "~/data/GeminiOptions";
import type { DialogueSettings } from "~/types/dialogue";
import { CREDITS_PER_CHAR } from "~/config/credits";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useTranslations } from "next-intl";

interface DialogueSettingsProps {
  settings: DialogueSettings;
  onChange: (updated: DialogueSettings) => void;
  creditsNeeded: number;
  totalChars: number;
}

export default function DialogueSettingsPanel({
  settings,
  onChange,
  creditsNeeded,
  totalChars,
}: DialogueSettingsProps) {
  const t = useTranslations("studio.dialogue.settings");
  const tStyles = useTranslations("studio.tts.styles");
  const tPaces = useTranslations("studio.tts.paces");

  const isPro = settings.model === "gemini-2.5-pro-preview-tts";

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4 p-2 sm:p-3">
        {/* Header */}
        <div>
          <h3 className="text-sm font-bold">{t("title")}</h3>
          <p className="text-muted-foreground text-xs">{t("subtitle")}</p>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Globe className="h-3 w-3" /> {t("language")}
          </Label>
          <Select
            value={settings.language}
            onValueChange={(value) =>
              onChange({ ...settings, language: value })
            }
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto" className="text-xs">
                {t("autoDetect")}
              </SelectItem>
              {SupportedLanguages.map((lang) => (
                <SelectItem
                  key={lang.code}
                  value={lang.code}
                  className="text-xs"
                >
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

        {/* Model Toggle — Flash / Pro */}
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
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold">
                {settings.model === "gemini-2.5-flash-preview-tts"
                  ? t("flashLabel")
                  : t("proLabel")}
              </p>
              <p className="text-muted-foreground text-xs">
                {isPro ? t("proSubLabel") : t("flashSubLabel")}
                <br />
                {isPro
                  ? `(${CREDITS_PER_CHAR.geminiProDialogue} credits / char)`
                  : `(${CREDITS_PER_CHAR.geminiFlashDialogue} credits / char)`}
              </p>
            </div>
            <Switch
              checked={settings.model === "gemini-2.5-pro-preview-tts"}
              onCheckedChange={(checked) =>
                onChange({
                  ...settings,
                  model: checked
                    ? "gemini-2.5-pro-preview-tts"
                    : "gemini-2.5-flash-preview-tts",
                })
              }
            />
          </div>
        </div>

        {/* Style */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Mic2 className="h-3 w-3" /> {t("style")}
          </Label>
          <Select
            value={settings.style}
            onValueChange={(value) =>
              onChange({
                ...settings,
                style: value as DialogueSettings["style"],
              })
            }
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GeminiStyles.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">
                  {tStyles(s.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pace */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Gauge className="h-3 w-3" /> {t("pace")}
          </Label>
          <Select
            value={settings.pace}
            onValueChange={(value) =>
              onChange({
                ...settings,
                pace: value as DialogueSettings["pace"],
              })
            }
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GeminiPaces.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-xs">
                  {tPaces(p.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Credits Estimate */}
        {totalChars > 0 && (
          <div className="text-muted-foreground flex items-center justify-between rounded-md border px-3 py-2 text-xs">
            <span>{t("estimatedCost")}</span>
            <span className="text-foreground font-semibold">
              {creditsNeeded} {creditsNeeded !== 1 ? t("credits") : t("credit")}
              <span className="text-muted-foreground ml-1 font-normal">
                ({totalChars} {t("chars")})
              </span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
