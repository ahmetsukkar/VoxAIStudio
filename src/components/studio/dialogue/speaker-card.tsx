"use client";

import { Volume2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import VoicePicker from "~/components/studio/tts/engines/voice-picker";
import type { DialogueSpeaker } from "~/types/dialogue";
import { speakerColors } from "~/types/dialogue";

interface SpeakerCardProps {
  speaker: DialogueSpeaker;
  onChange: (updated: DialogueSpeaker) => void;
}

const MAX_NAME_CHARS = 30;

export default function SpeakerCard({ speaker, onChange }: SpeakerCardProps) {
  const colors = speakerColors[speaker.color];
  const isNameNearLimit = MAX_NAME_CHARS - speaker.name.length <= 5;

  return (
    <Card className={`border-t-4 ${colors.border}`}>
      <CardContent className="space-y-3 pt-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg} text-sm font-bold text-white`}
          >
            {speaker.name.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <label className="text-muted-foreground text-xs">Name</label>
              <span
                className={`text-xs ${
                  isNameNearLimit ? "text-orange-500" : "text-muted-foreground"
                }`}
              >
                {speaker.name.length} / {MAX_NAME_CHARS}
              </span>
            </div>
            <input
              value={speaker.name}
              onChange={(e) => onChange({ ...speaker, name: e.target.value })}
              maxLength={MAX_NAME_CHARS}
              className="border-input bg-background w-full rounded-md border px-2 py-1 text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Voice */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Volume2 className="h-3 w-3" /> Voice
          </Label>
          <VoicePicker
            value={speaker.voice}
            onChange={(voice) => onChange({ ...speaker, voice })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
