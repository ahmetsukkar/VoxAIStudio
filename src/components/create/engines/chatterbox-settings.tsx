/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { Globe, Volume2, Upload, Loader2 } from "lucide-react";
import type { Language, VoiceFile, UploadedVoice } from "~/types/tts";
import type { ChatterboxOptions } from "~/types/engines";
import { toast } from "sonner";
import { useState } from "react";
import { uploadVoice } from "~/actions/voice-upload";

interface ChatterboxSettingsProps {
  languages: Language[];
  voiceFiles: VoiceFile[];
  options: ChatterboxOptions;
  setOptions: (options: ChatterboxOptions) => void;
  userUploadedVoices: UploadedVoice[];
  onVoiceUploaded: () => void;
}

export default function ChatterboxSettings({
  languages,
  voiceFiles,
  options,
  setOptions,
  userUploadedVoices,
  onVoiceUploaded,
}: ChatterboxSettingsProps) {
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);

  const handleVoiceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB!");
      return;
    }

    setIsUploadingVoice(true);
    try {
      const formData = new FormData();
      formData.append("voice", file);
      const result = await uploadVoice("aws", formData);
      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }
      toast.success("Voice uploaded successfully!");
      onVoiceUploaded(); // tell page.tsx to refresh the list
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload voice file");
    } finally {
      setIsUploadingVoice(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Language */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium">
          <Globe className="h-3 w-3" /> Language
        </label>
        <select
          value={options.language}
          onChange={(e) =>
            setOptions({ ...options, language: e.target.value })
          }
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
          value={options.voice}
          onChange={(e) =>
            setOptions({ ...options, voice: e.target.value })
          }
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
          <div className="flex items-center gap-1.5 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading...
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
          Upload a clear voice sample (WAV/MP3). Uploaded voices appear in the
          dropdown above.
        </p>
      </div>

      {/* Exaggeration */}
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-medium">
          <span>Emotion/Intensity</span>
          <span>&nbsp;{options.exaggeration.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={options.exaggeration}
          onChange={(e) =>
            setOptions({ ...options, exaggeration: parseFloat(e.target.value) })
          }
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
          <span>Pacing Control</span>
          <span>&nbsp;{options.cfgWeight.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={options.cfgWeight}
          onChange={(e) =>
            setOptions({ ...options, cfgWeight: parseFloat(e.target.value) })
          }
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
