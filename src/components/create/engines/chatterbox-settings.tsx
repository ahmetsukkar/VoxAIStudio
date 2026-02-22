"use client";

import { Globe, Volume2, Upload, Loader2 } from "lucide-react";
import type { Language, VoiceFile, UploadedVoice } from "~/types/tts";

interface ChatterboxSettingsProps {
  languages: Language[];
  voiceFiles: VoiceFile[];
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
}

export default function ChatterboxSettings({
  languages,
  voiceFiles,
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
}: ChatterboxSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Language */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Globe className="h-3 w-3" /> Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Volume2 className="h-3 w-3" /> Voice
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
        >
          {userUploadedVoices.map((voice) => (
            <option key={voice.id} value={voice.s3Key}>
              🎤 {voice.name}
            </option>
          ))}
          {voiceFiles.map((voice) => (
            <option key={voice.s3_key} value={voice.s3_key}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Upload */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Upload className="h-3 w-3" /> Upload Your Voice
        </label>
        {isUploadingVoice ? (
          <div className="flex items-center gap-2 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
          </div>
        ) : (
          <input
            type="file"
            accept="audio/*"
            onChange={handleVoiceUpload}
            className="w-full cursor-pointer text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-50 file:px-2 file:py-1 file:text-xs file:text-blue-700 file:hover:bg-blue-100"
          />
        )}
        <p className="text-muted-foreground text-xs">
          Upload a clear voice sample (WAV/MP3). Uploaded voices appear in the dropdown above.
        </p>
      </div>

      {/* Exaggeration */}
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5">Emotion/Intensity</span>
          <span className="text-muted-foreground">{exaggeration.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={exaggeration}
          onChange={(e) => setExaggeration(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Calm</span>
          <span>Expressive</span>
        </div>
      </div>

      {/* CFG Weight */}
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5">Pacing Control</span>
          <span className="text-muted-foreground">{cfgWeight.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={cfgWeight}
          onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Fast</span>
          <span>Accurate</span>
        </div>
      </div>
    </div>
  );
}
