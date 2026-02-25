"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { toast } from "sonner";
import { GeminiVoices } from "~/data/GeminiOptions";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import SpeakerCard from "./speaker-card";
import DialogueLineItem from "./dialogue-line-item";
import DialogueSettingsPanel from "./dialogue-settings";
import { generateDialogue } from "~/actions/tts/dialogue";

const CREDITS_PER_CHAR: Record<string, number> = {
  "gemini-2.5-flash-preview-tts": 6,
  "gemini-2.5-pro-preview-tts": 10,
};

export default function DialogueStudio() {
  const [speakers, setSpeakers] = useState<DialogueSpeaker[]>([
    { id: "s1", name: "John", voice: GeminiVoices[0]?.name ?? "Zephyr", color: "blue" },
    { id: "s2", name: "Mary", voice: GeminiVoices[3]?.name ?? "Kore", color: "green" },
  ]);

  const [lines, setLines] = useState<DialogueLine[]>([
    { id: "l1", speakerId: "s1", text: "", emotion: "neutral" },
    { id: "l2", speakerId: "s2", text: "", emotion: "neutral" },
  ]);

  const [settings, setSettings] = useState<DialogueSettings>({
    model: "gemini-2.5-flash-preview-tts",
    style: "conversational",
    pace: "normal",
    reverb: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  const creditsNeeded = totalChars * (CREDITS_PER_CHAR[settings.model] ?? 6);

  const updateSpeaker = (updated: DialogueSpeaker) => {
    setSpeakers((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const updateLine = (updated: DialogueLine) => {
    setLines((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const deleteLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `l${Date.now()}`,
        speakerId: "s1",
        text: "",
        emotion: "neutral" as const,
      },
    ]);
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
      toast.success("Dialogue generated successfully!");
    } catch (error) {
      console.error("Dialogue generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate dialogue";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">

        {/* Left Sidebar */}
        <div className="order-2 space-y-2 sm:space-y-3 lg:order-1 lg:col-span-1">

          {/* Audio Player */}
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

          {/* Settings */}
          <DialogueSettingsPanel
            settings={settings}
            onChange={setSettings}
            creditsNeeded={creditsNeeded}
            totalChars={totalChars}
          />
        </div>

        {/* Main Area */}
        <div className="order-1 space-y-4 lg:order-2 lg:col-span-2">

          {/* Section 1 — Speakers */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold">
              1. Define Speakers
            </h3>
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
            <h3 className="text-sm font-bold">
              2. Dialogue Lines
            </h3>
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

                {/* Add Line */}
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
        </div>
      </div>
    </div>
  );
}
