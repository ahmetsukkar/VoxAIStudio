import type {
  GeminiEmotion,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";
import type {
  DialogueLine,
  DialogueSpeaker,
  DialogueSettings,
} from "~/types/dialogue";

export function getEmotionInstruction(emotion: GeminiEmotion): string {
  switch (emotion) {
    case "cheerful":
      return "cheerful, very happy and bright";
    case "sad":
      return "sad, slow and mournful";
    case "angry":
      return "angry, sharp and intense (but still controlled)";
    case "excited":
      return "excited, high energy and enthusiastic";
    case "whispering":
      return "whispering, very quiet and breathy";
    case "emotional":
      return "emotional, with deep feeling and resonance";
    default:
      return "neutral, natural tone";
  }
}

export function getStyleInstruction(style: GeminiStyle): string {
  switch (style) {
    case "newsreader":
      return "clear, authoritative newsreader delivery";
    case "storytelling":
      return "warm, engaging storytelling with natural rhythm";
    case "podcast":
      return "relaxed, friendly podcast-host style";
    case "audiobook":
      return "clear and expressive, like a professional audiobook narrator";
    case "customer-support":
      return "calm, helpful, and professional customer-support tone";
    default:
      return "natural, conversational delivery";
  }
}

export function getPaceInstruction(pace: GeminiPace): string {
  switch (pace) {
    case "slow":
      return "slow and deliberate";
    case "fast":
      return "fast and energetic";
    default:
      return "normal, natural pace";
  }
}

export function buildTTSPrompt(
  text: string,
  emotion: GeminiEmotion = "neutral",
  style: GeminiStyle = "conversational",
  pace: GeminiPace = "normal",
  locale?: string,              // e.g., "tr-TR" or "en-US" (optional)
  pronunciationHints?: string,  // optional: "API = 'A P I'; SQL = 'sequel'"
): string {
  const rules = [
    "Read the TRANSCRIPT exactly as written.",
    "Do not add, remove, paraphrase, or answer the text.",
    "Keep punctuation and line breaks; do not speak the labels or headings.",
  ];

  const notes = [
    `Emotion: ${getEmotionInstruction(emotion)}`,
    `Style: ${getStyleInstruction(style)}`,
    `Pacing: ${getPaceInstruction(pace)}`,
    locale ? `Accent/locale: ${locale}` : null,
    pronunciationHints ? `Pronounce: ${pronunciationHints}` : null,
  ].filter(Boolean);

  return [
    "You are a TTS voice actor.",
    "",
    "Rules:",
    ...rules.map((r) => `- ${r}`),
    "",
    "DIRECTOR'S NOTES:",
    ...notes.map((n) => `- ${n}`),
    "",
    "TRANSCRIPT:",
    text,
  ].join("\n");
}

export function buildDialoguePrompt(
  speakers: DialogueSpeaker[],
  lines: DialogueLine[],
  settings: DialogueSettings,
): string {
  const speakerMap = Object.fromEntries(speakers.map((s) => [s.id, s]));

  const filledLines = lines.filter((l) => l.text.trim().length > 0);

  // Director note: style + pace
  const directorParts: string[] = [];

  if (settings.style !== "conversational") {
    directorParts.push(getStyleInstruction(settings.style));
  }
  if (settings.pace !== "normal") {
    directorParts.push(getPaceInstruction(settings.pace));
  }

  // Per-speaker emotion instruction
  const emotionParts = speakers
    .filter((s) => s.emotion !== "neutral")
    .map((s) => `Make ${s.name} sound ${getEmotionInstruction(s.emotion)}`);

  const allDirectorParts = [...directorParts, ...emotionParts];

  // Build transcript: "SpeakerName: text"
  const transcript = filledLines
    .map((l) => {
      const speaker = speakerMap[l.speakerId];
      return `${speaker?.name ?? "Speaker"}: ${l.text}`;
    })
    .join("\n");

  const directorNote =
    allDirectorParts.length > 0 ? `${allDirectorParts.join(". ")}:\n\n` : "";

  return `${directorNote}${transcript}`;
}
