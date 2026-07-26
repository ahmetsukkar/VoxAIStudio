"use client";

import { Settings, Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { type TTSProviderType } from "~/actions/tts/tts-factory";
import GeminiSettings from "./engines/gemini-settings";
import type { EngineOptionsMap } from "~/types/engines";
import { calcTTSCredits } from "~/lib/credits/calculate";
import { usePlanStore } from "~/store/plan-store";
import { useTranslations } from "next-intl";

interface SpeechSettingsProps {
  selectedEngine: TTSProviderType;
  engineOptions: EngineOptionsMap;
  setEngineOptions: (options: EngineOptionsMap) => void;
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function SpeechSettings({
  selectedEngine,
  engineOptions,
  setEngineOptions,
  text,
  isGenerating,
  onGenerate,
}: SpeechSettingsProps) {
  const t = useTranslations("studio.tts.settings");
  const isTrialTier = usePlanStore((s) => s.isTrialTier) ?? false;
  const creditsNeeded = calcTTSCredits(
    selectedEngine,
    text,
    engineOptions.gemini.model,
  );

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2 sm:p-3">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <div>
              <h3 className="text-sm font-semibold">{t("title")}</h3>
              <p className="text-muted-foreground text-xs">{t("subtitle")}</p>
            </div>
          </div>

          {selectedEngine === "gemini" && (
            <GeminiSettings
              options={engineOptions.gemini}
              setOptions={(updated) =>
                setEngineOptions({ ...engineOptions, gemini: updated })
              }
              isTrialTier={isTrialTier}
            />
          )}

          {text.trim() && (
            <p className="text-muted-foreground text-xs">
              {t("cost")}{" "}
              <span className="font-medium">
                {creditsNeeded} {creditsNeeded > 1 ? t("credits") : t("credit")}
              </span>{" "}
              ({text.length} {t("characters")})
            </p>
          )}

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !text.trim()}
            className="h-9 w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("generating")}
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                {t("generate")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}