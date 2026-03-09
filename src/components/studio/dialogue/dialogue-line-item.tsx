"use client";

import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type {
  DialogueLine,
  DialogueSpeaker,
  SpeakerId,
} from "~/types/dialogue";
import { speakerColors } from "~/types/dialogue";
import { MAX_CHARS_PER_DIALOGUE_LINE } from "~/config/credits";

interface DialogueLineItemProps {
  line: DialogueLine;
  speakers: DialogueSpeaker[];
  canDelete: boolean;
  onChange: (updated: DialogueLine) => void;
  onDelete: () => void;
}

export default function DialogueLineItem({
  line,
  speakers,
  canDelete,
  onChange,
  onDelete,
}: DialogueLineItemProps) {
  const speaker = speakers.find((s) => s.id === line.speakerId);
  const avatarColor = speaker ? speakerColors[speaker.color].bg : "bg-gray-400";
  const isNearLimit = line.text.length >= MAX_CHARS_PER_DIALOGUE_LINE * 0.9;

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
        {/* Speaker selector + Delete */}
        <div className="flex items-center gap-2">
          <Select
            value={line.speakerId}
            onValueChange={(value) =>
              onChange({ ...line, speakerId: value as SpeakerId })
            }
          >
            <SelectTrigger className="h-7 w-auto text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {speakers.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

        {/* Text area — no maxLength so user can type freely; total is checked at submit */}
        <textarea
          value={line.text}
          onChange={(e) => onChange({ ...line, text: e.target.value })}
          rows={2}
          placeholder="Enter dialogue text…"
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />

        {/* Per-line counter — soft guidance only */}
        <p
          className={`text-right text-xs ${
            isNearLimit ? "text-orange-500" : "text-muted-foreground"
          }`}
        >
          {line.text.length} / {MAX_CHARS_PER_DIALOGUE_LINE}
        </p>
      </div>
    </div>
  );
}
