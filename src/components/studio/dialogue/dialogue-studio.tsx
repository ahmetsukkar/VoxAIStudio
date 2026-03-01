"use client";

import { useState } from "react";
import { Loader2, Plus, Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { toast } from "sonner";
import { GeminiVoices } from "~/data/GeminiOptions";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
  SpeakerId,
} from "~/types/dialogue";
import SpeakerCard from "./speaker-card";
import DialogueLineItem from "./dialogue-line-item";
import DialogueSettingsPanel from "./dialogue-settings";
import RecentGenerations from "~/components/studio/recent-generations";
import { generateDialogue } from "~/actions/tts/dialogue";

export default function DialogueStudio() {
  const [speakers, setSpeakers] = useState<DialogueSpeaker[]>([
    {
      id: "s1",
      name: "John",
      voice: GeminiVoices[0]?.name ?? "Zephyr",
      color: "blue",
    },
    {
      id: "s2",
      name: "Mary",
      voice: GeminiVoices[3]?.name ?? "Kore",
      color: "green",
    },
  ]);

  const [lines, setLines] = useState<DialogueLine[]>([
    { id: "l1", speakerId: "s1", text: "", emotion: "neutral" },
    { id: "l2", speakerId: "s2", text: "", emotion: "neutral" },
  ]);

  const [settings, setSettings] = useState<DialogueSettings>({
    model: "gemini-2.5-flash-preview-tts",
    style: "conversational",
    pace: "normal",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  const creditsNeeded = calcGeminiDialogueCredits(lines, settings);

  const updateSpeaker = (updated: DialogueSpeaker) =>
    setSpeakers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const updateLine = (updated: DialogueLine) =>
    setLines((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

  const deleteLine = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const addLine = () => {
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const lastSpeaker = lastLine?.speakerId ?? speakers[0]?.id;
      const lastIndex = speakers.findIndex((s) => s.id === lastSpeaker);
      const nextSpeakerId: SpeakerId =
        speakers[(lastIndex + 1) % speakers.length]?.id ?? "s1";

      return [
        ...prev,
        {
          id: `l${Date.now()}`,
          speakerId: nextSpeakerId,
          text: "",
          emotion: "neutral" as const,
        },
      ];
    });
  };

  const handleGenerate = async () => {
    if (lines.some((l) => !l.text.trim())) {
      toast.error("Please fill in all dialogue lines before generating.");
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const result = await generateDialogue({ speakers, lines, settings });

      if (!result.success || !result.audioUrl) {
        throw new Error(result.error ?? "Generation failed");
      }

      setAudioUrl(result.audioUrl);

      // Trigger RecentGenerations to re-fetch
      setRefreshTrigger((prev) => prev + 1);

      toast.success("Dialogue generated successfully!");
    } catch (error) {
      console.error("Dialogue generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate dialogue",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
        {/* ── LEFT SIDEBAR — desktop only ── */}
        <div className="hidden space-y-2 sm:space-y-3 lg:col-span-1 lg:block">
          <Card className="shadow-lg">
            <CardContent className="p-2 sm:p-3">
              <h3 className="mb-2 text-sm font-bold">Player</h3>
              {audioUrl ? (
                <audio
                  key={audioUrl}
                  controls
                  autoPlay
                  className="w-full"
                  src={audioUrl}
                />
              ) : (
                <p className="text-muted-foreground py-6 text-center text-xs italic">
                  Waiting for first generation...
                </p>
              )}
            </CardContent>
          </Card>

          <DialogueSettingsPanel
            settings={settings}
            onChange={setSettings}
            creditsNeeded={creditsNeeded}
            totalChars={totalChars}
          />
        </div>

        {/* ── MAIN AREA ── */}
        <div className="space-y-4 lg:col-span-2">
          {/* ── MOBILE ONLY — Player + Settings toggle ── */}
          <div className="space-y-2 lg:hidden">
            <Card className="shadow-sm">
              <CardContent className="p-2">
                {audioUrl ? (
                  <audio
                    key={audioUrl}
                    controls
                    autoPlay
                    className="w-full"
                    src={audioUrl}
                  />
                ) : (
                  <p className="text-muted-foreground py-3 text-center text-xs italic">
                    Waiting for first generation...
                  </p>
                )}
              </CardContent>
            </Card>

            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="bg-muted hover:bg-muted/80 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Settings
                {creditsNeeded > 0 && (
                  <span className="text-muted-foreground text-xs font-normal">
                    · {creditsNeeded} credits
                  </span>
                )}
              </span>
              {settingsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {settingsOpen && (
              <DialogueSettingsPanel
                settings={settings}
                onChange={setSettings}
                creditsNeeded={creditsNeeded}
                totalChars={totalChars}
              />
            )}
          </div>

          {/* Section 1 — Speakers */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold">1. Define Speakers</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  onChange={updateSpeaker}
                />
              ))}
            </div>
          </div>

          {/* Section 2 — Dialogue Lines */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold">2. Dialogue Lines</h3>
            <Card>
              <CardContent className="space-y-4 p-3 sm:p-4">
                {lines.map((line) => (
                  <DialogueLineItem
                    key={line.id}
                    line={line}
                    speakers={speakers}
                    canDelete={lines.length > 2}
                    onChange={updateLine}
                    onDelete={() => deleteLine(line.id)}
                  />
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={addLine}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <div className="space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || totalChars === 0}
              className="h-11 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Dialogue...
                </>
              ) : (
                "🎭 Generate Full Dialogue"
              )}
            </Button>

            {!isGenerating && totalChars === 0 && (
              <p className="text-muted-foreground text-center text-xs">
                Fill in the dialogue lines above to generate audio
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Generations — Dialogue only */}
      <RecentGenerations group="dialogue" refreshTrigger={refreshTrigger} />
    </div>
  );
}
