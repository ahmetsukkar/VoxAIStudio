"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { env } from "~/env";
import { uploadGeneratedAudio } from "~/actions/tts/providers/s3-upload-helper";
import { v4 as uuidv4 } from "uuid";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import { buildTTSPrompt } from "~/lib/tts/prompt-builder";
import { encodeWav } from "~/lib/audio/wav-encoder";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";

export interface DialogueGenerateResult {
  success: boolean;
  audioUrl?: string;
  s3Key?: string;
  fullText?: string;
  creditsNeeded?: number;
  error?: string;
}

export async function generateDialogueAudio({
  speakers,
  lines,
  settings,
}: {
  speakers: DialogueSpeaker[];
  lines: DialogueLine[];
  settings: DialogueSettings;
}): Promise<DialogueGenerateResult> {
  // 1. Validate
  const filledLines = lines.filter((l) => l.text.trim().length > 0);
  if (filledLines.length === 0) {
    return { success: false, error: "Add at least one dialogue line with text." };
  }

  const creditsNeeded = calcGeminiDialogueCredits(filledLines, settings);

  // 2. Build speaker lookup map
  const speakersMap = Object.fromEntries(speakers.map((s) => [s.id, s]));

  // 3. Generate audio per line, collect PCM chunks
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  const pcmChunks: Uint8Array[] = [];

  for (const line of filledLines) {
    const speaker = speakersMap[line.speakerId];
    if (!speaker) continue;

    const prompt = buildTTSPrompt(
      line.text,
      line.emotion,
      settings.style,
      settings.pace,
    );

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: speaker.voice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return { success: false, error: `No audio returned for line: "${line.text}"` };
    }

    pcmChunks.push(new Uint8Array(Buffer.from(base64Audio, "base64")));
  }

  if (pcmChunks.length === 0) {
    return { success: false, error: "No audio was generated." };
  }

  // 4. Encode WAV + upload to S3
  const wavBuffer = encodeWav(pcmChunks);
  const s3Key     = `generated/dialogue/${uuidv4()}.wav`;
  const audioUrl  = await uploadGeneratedAudio(wavBuffer, s3Key);

  // 5. Build full text for DB
  const fullText = filledLines
    .map((l) => `${speakersMap[l.speakerId]?.name ?? "Speaker"}: ${l.text}`)
    .join("\n");

  return { success: true, audioUrl, s3Key, fullText, creditsNeeded };
}
