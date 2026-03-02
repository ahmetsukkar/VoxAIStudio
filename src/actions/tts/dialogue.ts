"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { env } from "~/env";
import { uploadGeneratedAudio } from "~/actions/tts/providers/s3-upload-helper";
import { v4 as uuidv4 } from "uuid";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";
import { buildTTSPrompt } from "~/lib/tts/prompt-builder";
import { encodeWav } from "~/lib/audio/wav-encoder";

export async function generateDialogue({
  speakers,
  lines,
  settings,
}: {
  speakers: DialogueSpeaker[];
  lines: DialogueLine[];
  settings: DialogueSettings;
}): Promise<{
  success: boolean;
  audioUrl?: string;
  s3_key?: string;
  error?: string;
}> {
  try {
    // 1. Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate
    const filledLines = lines.filter((l) => l.text.trim().length > 0);
    if (filledLines.length === 0) {
      return {
        success: false,
        error: "Add at least one dialogue line with text.",
      };
    }

    // 3. Credits check
    const creditsNeeded = calcGeminiDialogueCredits(filledLines, settings);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) return { success: false, error: "User not found" };
    if (Number(user.credits) < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${String(user.credits)}`,
      };
    }

    // 4. Build speaker lookup map
    const speakersMap = Object.fromEntries(speakers.map((s) => [s.id, s]));

    // 5. Generate audio per line, collect PCM chunks
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
        return {
          success: false,
          error: `No audio returned for line: "${line.text}"`,
        };
      }

      const pcm = new Uint8Array(Buffer.from(base64Audio, "base64"));
      pcmChunks.push(pcm);
    }

    if (pcmChunks.length === 0) {
      return { success: false, error: "No audio was generated." };
    }

    // 6. Encode all PCM chunks into one WAV file
    const wavBuffer = encodeWav(pcmChunks);

    // 7. Upload to S3
    const s3Key = `generated/dialogue/${uuidv4()}.wav`;
    const audioUrl = await uploadGeneratedAudio(wavBuffer, s3Key);

    // 8. Deduct credits
    await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
    });

    // 9. Save to DB
    const fullText = filledLines
      .map((l) => {
        const spk = speakersMap[l.speakerId];
        return `${spk?.name ?? "Speaker"}: ${l.text}`;
      })
      .join("\n");

    await db.audioProject.create({
      data: {
        text: fullText,
        audioUrl,
        s3Key,
        language: "autodetect",
        engine: "gemini-dialogue",
        geminiVoice: null,
        geminiEmotion: null,
        geminiStyle: null,
        geminiPace: null,
        userId: session.user.id,
      },
    });

    return { success: true, audioUrl, s3_key: s3Key };
  } catch (error) {
    console.error("Dialogue generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}
