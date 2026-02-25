"use client";

import { Volume2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { GeminiVoices } from "~/data/GeminiOptions";
import type { DialogueSpeaker } from "~/types/dialogue";

interface SpeakerCardProps {
  speaker: DialogueSpeaker;
  onChange: (updated: DialogueSpeaker) => void;
}

const colorMap = {
  blue:  { bg: "bg-blue-500",  border: "border-blue-500"  },
  green: { bg: "bg-green-500", border: "border-green-500" },
};

export default function SpeakerCard({ speaker, onChange }: SpeakerCardProps) {
  const colors = colorMap[speaker.color];

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
            <label className="text-muted-foreground text-xs">Name</label>
            <input
              value={speaker.name}
              onChange={(e) => onChange({ ...speaker, name: e.target.value })}
              className="border-input bg-background w-full rounded-md border px-2 py-1 text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Voice */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-xs font-medium">
            <Volume2 className="h-3 w-3" /> Voice
          </label>
          <select
            value={speaker.voice}
            onChange={(e) => onChange({ ...speaker, voice: e.target.value })}
            className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
          >
            {GeminiVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} — {v.description}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
