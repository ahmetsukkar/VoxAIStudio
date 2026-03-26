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
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";
import { buildDialoguePrompt } from "~/lib/tts/prompt-builder";
import { encodeWav } from "~/lib/audio/wav-encoder";

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
  const filledLines = lines.filter((l) => l.text.trim().length > 0);

  if (filledLines.length === 0) {
    return {
      success: false,
      error: "Add at least one dialogue line with text.",
    };
  }

  if (speakers.length < 2) {
    return { success: false, error: "At least 2 speakers are required." };
  }

  const creditsNeeded = calcGeminiDialogueCredits(filledLines, settings);

  // Always use Latin aliases — works for all models (flash, pro, future)
  // Speaker names are only for UI/DB, not for the Gemini prompt mapping
  const speakerIdToAlias = new Map(
    speakers.map((s, i) => [s.id, `Speaker${i + 1}`]),
  );

  const prompt = buildDialoguePrompt(
    speakers,
    filledLines,
    settings,
    speakerIdToAlias,
  );

  const ai = new GoogleGenAI({ apiKey: env.GenerativeLanguageAPIKey });

  try {
    const response = await ai.models.generateContent({
      model: settings.model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakers.map((s, i) => ({
              speaker: `Speaker${i + 1}`, // Latin alias — model-agnostic
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: s.voice },
              },
            })),
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return { success: false, error: "No audio returned" };
    }

    const pcmBuffer = Buffer.from(base64Audio, "base64");
    const wavBuffer = encodeWav([new Uint8Array(pcmBuffer)]);

    const s3Key = `generated/dialogue/${uuidv4()}.wav`;
    const audioUrl = await uploadGeneratedAudio(wavBuffer, s3Key);

    // DB record uses real speaker names, not aliases
    const speakerMap = Object.fromEntries(speakers.map((s) => [s.id, s]));
    const fullText = filledLines
      .map((l) => `${speakerMap[l.speakerId]?.name ?? "Speaker"}: ${l.text}`)
      .join("\n");

    return { success: true, audioUrl, s3Key, fullText, creditsNeeded };
  } catch (error) {
    console.error("Gemini dialogue error:", JSON.stringify(error));
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gemini API failed",
    };
  }
}
