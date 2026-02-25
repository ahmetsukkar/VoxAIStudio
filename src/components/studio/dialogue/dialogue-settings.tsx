"use client";

import { Cpu, Gauge, Mic2, Waves } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { GeminiStyles, GeminiPaces } from "~/data/GeminiOptions";
import type { DialogueSettings } from "~/types/dialogue";

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
  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4 p-2 sm:p-3">
        {/* Header */}
        <div>
          <h3 className="text-sm font-bold">Settings</h3>
          <p className="text-muted-foreground text-xs">
            Applied to full dialogue
          </p>
        </div>

        {/* Model Toggle — Flash / Pro */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Cpu className="h-3 w-3" /> Model
          </Label>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-xs">
              {settings.model === "gemini-2.5-flash-preview-tts"
                ? "Flash — Fast & Affordable"
                : "Pro — Highest Quality"}
            </span>
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
            <Mic2 className="h-3 w-3" /> Style
          </Label>
          <select
            value={settings.style}
            onChange={(e) =>
              onChange({
                ...settings,
                style: e.target.value as DialogueSettings["style"],
              })
            }
            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
          >
            {GeminiStyles.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pace */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Gauge className="h-3 w-3" /> Pace
          </Label>
          <select
            value={settings.pace}
            onChange={(e) =>
              onChange({
                ...settings,
                pace: e.target.value as DialogueSettings["pace"],
              })
            }
            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
          >
            {GeminiPaces.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reverb Toggle */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Waves className="h-3 w-3" /> Reverb
          </Label>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-xs">
              {settings.reverb ? "On" : "Off"}
            </span>
            <Switch
              checked={settings.reverb}
              onCheckedChange={(checked) =>
                onChange({ ...settings, reverb: checked })
              }
            />
          </div>
        </div>

        {/* Credits Estimate */}
        {totalChars > 0 && (
          <div className="rounded-md bg-blue-50 px-3 py-2 text-center">
            <p className="text-xs text-blue-700">
              Cost:{" "}
              <span className="font-bold">
                {creditsNeeded} credit{creditsNeeded !== 1 ? "s" : ""}
              </span>{" "}
              ({totalChars} characters)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
