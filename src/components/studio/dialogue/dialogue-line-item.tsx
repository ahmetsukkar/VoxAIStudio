"use client";

import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GeminiEmotions } from "~/data/GeminiOptions";
import type { DialogueLine, DialogueSpeaker } from "~/types/dialogue";

interface DialogueLineItemProps {
  line: DialogueLine;
  speakers: DialogueSpeaker[];
  canDelete: boolean;
  onChange: (updated: DialogueLine) => void;
  onDelete: () => void;
}

const colorMap = {
  blue:  "bg-blue-500",
  green: "bg-green-500",
};

export default function DialogueLineItem({
  line,
  speakers,
  canDelete,
  onChange,
  onDelete,
}: DialogueLineItemProps) {
  const speaker = speakers.find((s) => s.id === line.speakerId);
  const avatarColor = speaker ? colorMap[speaker.color] : "bg-gray-400";

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${avatarColor} text-xs font-bold text-white`}
      >
        {speaker?.name.charAt(0).toUpperCase() ?? "?"}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Speaker + Emotion selectors */}
        <div className="flex items-center gap-2">
          <select
            value={line.speakerId}
            onChange={(e) =>
              onChange({ ...line, speakerId: e.target.value as "s1" | "s2" })
            }
            className="border-input bg-background rounded-md border px-2 py-1 text-xs font-semibold"
          >
            {speakers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={line.emotion}
            onChange={(e) =>
              onChange({
                ...line,
                emotion: e.target.value as DialogueLine["emotion"],
              })
            }
            className="border-input bg-background rounded-md border px-2 py-1 text-xs"
          >
            {GeminiEmotions.map((em) => (
              <option key={em.value} value={em.value}>
                {em.label}
              </option>
            ))}
          </select>

          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-7 w-7 text-red-400 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Text area */}
        <textarea
          value={line.text}
          onChange={(e) => onChange({ ...line, text: e.target.value })}
          rows={2}
          placeholder="Enter dialogue text..."
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}
