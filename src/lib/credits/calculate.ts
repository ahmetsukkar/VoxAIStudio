import { CREDITS_PER_CHAR } from "~/config/credits";
import type { TTSProviderType } from "~/actions/tts/tts-factory";
import type { DialogueLine, DialogueSettings } from "~/types/dialogue";

export function calcGeminiTTSCredits(
  charCount: number,
  model:
    | "gemini-2.5-flash-preview-tts"
    | "gemini-2.5-pro-preview-tts" = "gemini-2.5-flash-preview-tts",
): number {
  const isPro = model === "gemini-2.5-pro-preview-tts";
  return (
    charCount *
    (isPro ? CREDITS_PER_CHAR.geminiProTTS : CREDITS_PER_CHAR.geminiFlashTTS)
  );
}

export function calcGeminiDialogueCredits(
  lines: DialogueLine[],
  settings: DialogueSettings,
): number {
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  const isPro = settings.model === "gemini-2.5-pro-preview-tts";
  return (
    totalChars *
    (isPro
      ? CREDITS_PER_CHAR.geminiProDialogue
      : CREDITS_PER_CHAR.geminiFlashDialogue)
  );
}

// ─── Convenience wrapper for TTS Studio UI ───────────────────────────────────
export function calcTTSCredits(
  providerType: TTSProviderType,
  text: string,
  geminiModel?: "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts",
): number {
  switch (providerType) {
    case "gemini":
      return calcGeminiTTSCredits(text.length, geminiModel);
    default:
      return 0;
  }
}
