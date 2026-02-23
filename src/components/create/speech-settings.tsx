"use client";

import { Settings, Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { Language, VoiceFile, UploadedVoice } from "~/types/tts";
import type { TTSProviderType } from "~/actions/tts/tts-factory";
import { calculateCredit } from "~/actions/tts";
import { useEffect, useState } from "react";
import ChatterboxSettings from "./engines/chatterbox-settings";
import GeminiSettings from "./engines/gemini-settings";
import type { EngineOptionsMap } from "~/types/engines";

interface SpeechSettingsProps {
  languages: Language[];
  voiceFiles: VoiceFile[];
  selectedEngine: TTSProviderType;
  setSelectedEngine: (engine: TTSProviderType) => void;
  engineOptions: EngineOptionsMap;
  setEngineOptions: (options: EngineOptionsMap) => void;
  userUploadedVoices: UploadedVoice[];
  onVoiceUploaded: () => void;
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function SpeechSettings({
  languages,
  voiceFiles,
  selectedEngine,
  setSelectedEngine,
  engineOptions,
  setEngineOptions,
  userUploadedVoices,
  onVoiceUploaded,
  text,
  isGenerating,
  onGenerate,
}: SpeechSettingsProps) {
  const [creditsNeeded, setCreditsNeeded] = useState(0);

  useEffect(() => {
    async function run() {
      const value = await calculateCredit(selectedEngine, text.length);
      setCreditsNeeded(value);
    }
    void run();
  }, [text, selectedEngine]);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2 sm:p-3">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <div>
              <h3 className="text-sm font-semibold">Settings</h3>
              <p className="text-muted-foreground text-xs">
                Customize your speech
              </p>
            </div>
          </div>

          {/* Engine Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Engine</label>
            <select
              value={selectedEngine}
              onChange={(e) =>
                setSelectedEngine(e.target.value as TTSProviderType)
              }
              className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
            >
              <option value="chatterbox">Chatterbox — Voice Cloning</option>
              <option value="gemini">Gemini 2.5 Flash TTS</option>
            </select>
          </div>

          {/* Engine-specific settings */}
          {selectedEngine === "chatterbox" && (
            <ChatterboxSettings
              languages={languages}
              voiceFiles={voiceFiles}
              options={engineOptions.chatterbox}
              setOptions={(updated) =>
                setEngineOptions({ ...engineOptions, chatterbox: updated })
              }
              userUploadedVoices={userUploadedVoices}
              onVoiceUploaded={onVoiceUploaded}
            />
          )}
          {selectedEngine === "gemini" && (
            <GeminiSettings
              options={engineOptions.gemini}
              setOptions={(updated) =>
                setEngineOptions({ ...engineOptions, gemini: updated })
              }
            />
          )}

          {/* Credits display */}
          {text.trim() && (
            <p className="text-muted-foreground text-xs">
              Cost:{" "}
              <span className="font-medium">
                {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}
              </span>{" "}
              ({text.length} characters)
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
                Generating...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Generate Speech
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
