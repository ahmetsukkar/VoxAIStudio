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
import { GeminiEmotions } from "~/data/GeminiOptions";
import type { DialogueLine, DialogueSpeaker, SpeakerId } from "~/types/dialogue";
import { speakerColors } from "~/types/dialogue";

interface DialogueLineItemProps {
  line: DialogueLine;
  speakers: DialogueSpeaker[];
  canDelete: boolean;
  onChange: (updated: DialogueLine) => void;
  onDelete: () => void;
}

const MAX_LINE_CHARS = 500;

export default function DialogueLineItem({
  line,
  speakers,
  canDelete,
  onChange,
  onDelete,
}: DialogueLineItemProps) {
  const speaker = speakers.find((s) => s.id === line.speakerId);
  const avatarColor = speaker ? speakerColors[speaker.color].bg : "bg-gray-400";
  const charsLeft = MAX_LINE_CHARS - line.text.length;
  const isNearLimit = charsLeft <= 50;

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
        {/* Speaker + Emotion + Delete */}
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

          <Select
            value={line.emotion}
            onValueChange={(value) =>
              onChange({
                ...line,
                emotion: value as DialogueLine["emotion"],
              })
            }
          >
            <SelectTrigger className="h-7 w-auto text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GeminiEmotions.map((em) => (
                <SelectItem key={em.value} value={em.value} className="text-xs">
                  {em.label}
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

        {/* Text area */}
        <textarea
          value={line.text}
          onChange={(e) => onChange({ ...line, text: e.target.value })}
          rows={2}
          maxLength={MAX_LINE_CHARS}
          placeholder="Enter dialogue text..."
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />

        {/* Character counter */}
        <p
          className={`text-right text-xs ${
            isNearLimit ? "text-orange-500" : "text-muted-foreground"
          }`}
        >
          {line.text.length} / {MAX_LINE_CHARS}
        </p>
      </div>
    </div>
  );
}
