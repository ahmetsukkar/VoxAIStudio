"use server";

import type {
  TTSOptions,
  GenerateSpeechFinalResult,
  ChatterboxRequestOptions,
  GeminiRequestOptions,
} from "./tts/providers/base-tts-provider";
import { TTSFactory, type TTSProviderType } from "./tts/tts-factory";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { cache } from "react";
import { generateDialogueAudio } from "./tts/dialogue";
import type { DialogueSpeaker, DialogueLine, DialogueSettings } from "~/types/dialogue";

export async function generateSpeech(
  providerType: TTSProviderType,
  options: TTSOptions,
): Promise<GenerateSpeechFinalResult> {
  try {
    // 1. Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Get provider + calculate credits needed
    const provider = TTSFactory.getProvider(providerType);
    const creditsNeeded = provider.getCredits(options);

    // 3. Check credits
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

    // 4. Generate audio (provider's only job)
    const result = await provider.generateSpeech(options);
    if (!result.success || !result.audioUrl || !result.s3_key) {
      return { success: false, error: result.error ?? "Generation failed" };
    }

    // 5. Deduct credits
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
      select: { credits: true },
    });

    // 6. Save to DB (centralized for all engines)
    const isGemini = providerType === "gemini";
    const chatterboxOpts = !isGemini ? (options as ChatterboxRequestOptions) : null;
    const geminiOpts = isGemini ? (options as GeminiRequestOptions) : null;

    const audioProject = await db.audioProject.create({
      data: {
        text: options.text,
        audioUrl: result.audioUrl,
        s3Key: result.s3_key,
        language: chatterboxOpts?.language ?? "autodetect",
        voiceS3Key: chatterboxOpts?.voice_S3_key ?? geminiOpts?.voice_name,
        engine: geminiOpts?.gemini_model ?? providerType,
        exaggeration: chatterboxOpts?.exaggeration,
        cfgWeight: chatterboxOpts?.cfg_weight,
        geminiVoice: geminiOpts?.voice_name,
        geminiEmotion: geminiOpts?.gemini_emotion,
        geminiStyle: geminiOpts?.gemini_style,
        geminiPace: geminiOpts?.gemini_pace,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      s3_key: result.s3_key,
      audioUrl: result.audioUrl,
      projectId: audioProject.id,
      creditsRemaining: Math.floor(Number(updatedUser.credits)), // ← key addition
    };
  } catch (error) {
    console.error("Speech generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function generateDialogue({
  speakers,
  lines,
  settings,
}: {
  speakers: DialogueSpeaker[];
  lines: DialogueLine[];
  settings: DialogueSettings;
}): Promise<{ success: boolean; audioUrl?: string; s3_key?: string; creditsRemaining?: number; error?: string }> {
  try {
    // 1. Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // 2. Generate audio (dialogue.ts only job now)
    const result = await generateDialogueAudio({ speakers, lines, settings });
    if (!result.success || !result.audioUrl || !result.s3Key || !result.fullText) {
      return { success: false, error: result.error ?? "Generation failed" };
    }

    const creditsNeeded = result.creditsNeeded ?? 0;

    // 3. Credits check
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

    // 4. Deduct credits
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
      select: { credits: true },
    });

    // 5. Save to DB
    await db.audioProject.create({
      data: {
        text:     result.fullText,
        audioUrl: result.audioUrl,
        s3Key:    result.s3Key,
        language: "autodetect",
        engine:   "gemini-dialogue",
        userId:   session.user.id,
      },
    });

    return {
      success: true,
      audioUrl:         result.audioUrl,
      s3_key:           result.s3Key,
      creditsRemaining: Math.floor(Number(updatedUser.credits)),
    };
  } catch (error) {
    console.error("Dialogue generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export const getUserAudioProjects = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const audioProjects = await db.audioProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, audioProjects };
  } catch (error) {
    console.error("Error fetching audio projects:", error);
    return { success: false, error: "Failed to fetch audio projects" };
  }
});

export async function getUserCredits() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", credits: 0 };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found", credits: 0 };
    }

    return { success: true, credits: Math.floor(Number(user.credits)) };
  } catch (error) {
    console.log("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
}

export async function deleteAudioProject(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await db.audioProject.findUnique({
      where: { id },
    });

    if (project?.userId !== session.user.id) {
      return { success: false, error: "Not found or unauthorized" };
    }

    await db.audioProject.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting audio project:", error);
    return { success: false, error: "Failed to delete audio project" };
  }
}

export type EngineGroup = "tts" | "dialogue";

const TTS_ENGINES = [
  "chatterbox",
  "gemini-2.5-flash-preview-tts",
  "gemini-2.5-pro-preview-tts",
];
const DIALOGUE_ENGINES = ["gemini-dialogue"];

export async function getRecentGenerations(group: EngineGroup, limit = 4) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id)
      return { success: false, error: "Unauthorized", projects: [] };

    const engines = group === "dialogue" ? DIALOGUE_ENGINES : TTS_ENGINES;

    const projects = await db.audioProject.findMany({
      where: {
        userId: session.user.id,
        engine: { in: engines },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching recent generations:", error);
    return { success: false, error: "Failed to fetch", projects: [] };
  }
}
