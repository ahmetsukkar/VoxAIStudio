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
import type {
  GeminiVoices,
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

interface SpeechSettingsProps {
  // existing props stay exactly the same...
  languages: Language[];
  voiceFiles: VoiceFile[];
  selectedEngine: TTSProviderType;
  setSelectedEngine: (engine: TTSProviderType) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  exaggeration: number;
  setExaggeration: (value: number) => void;
  cfgWeight: number;
  setCfgWeight: (value: number) => void;
  userUploadedVoices: UploadedVoice[];
  isUploadingVoice: boolean;
  handleVoiceUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
  // Gemini-specific props
  geminiVoice: string;
  setGeminiVoice: (voice: string) => void;
  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
  geminiEmotion: GeminiEmotion;
  setGeminiEmotion: (emotion: GeminiEmotion) => void;
  geminiStyle: GeminiStyle;
  setGeminiStyle: (style: GeminiStyle) => void;
  geminiPace: GeminiPace;
  setGeminiPace: (pace: GeminiPace) => void;
}

export default function SpeechSettings({
  languages,
  voiceFiles,
  selectedEngine,
  setSelectedEngine,
  selectedLanguage,
  setSelectedLanguage,
  selectedVoice,
  setSelectedVoice,
  exaggeration,
  setExaggeration,
  cfgWeight,
  setCfgWeight,
  userUploadedVoices,
  isUploadingVoice,
  handleVoiceUpload,
  text,
  isGenerating,
  onGenerate,
  geminiVoice,
  setGeminiVoice,
  geminiModel,
  setGeminiModel,
  geminiEmotion,
  setGeminiEmotion,
  geminiStyle,
  setGeminiStyle,
  geminiPace,
  setGeminiPace
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
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              exaggeration={exaggeration}
              setExaggeration={setExaggeration}
              cfgWeight={cfgWeight}
              setCfgWeight={setCfgWeight}
              userUploadedVoices={userUploadedVoices}
              isUploadingVoice={isUploadingVoice}
              handleVoiceUpload={handleVoiceUpload}
            />
          )}

          {selectedEngine === "gemini" && (
            <GeminiSettings
              selectedVoice={geminiVoice}
              setSelectedVoice={setGeminiVoice}
              geminiModel={geminiModel}
              setGeminiModel={setGeminiModel}
              geminiEmotion={geminiEmotion}
              setGeminiEmotion={setGeminiEmotion}
              geminiStyle={geminiStyle}
              setGeminiStyle={setGeminiStyle}
              geminiPace={geminiPace}
              setGeminiPace={setGeminiPace}
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

          {/* Generate Button */}
          {isGenerating ? (
            <Button disabled className="w-full" size="sm">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Generating...
            </Button>
          ) : (
            <Button onClick={onGenerate} className="w-full" size="sm">
              Generate Speech
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
