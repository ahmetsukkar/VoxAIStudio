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
import { generateDialogueAudio } from "./tts/dialogue";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import { detectLanguage } from "~/lib/tts/detect-language";

const FREE_CREDITS_LIMIT = 5000;
const UNVERIFIED_CREDIT_THRESHOLD = 3000; // block generation after 3000 credits used

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
      select: { credits: true, emailVerified: true },
    });

    if (!user) return { success: false, error: "User not found" };

    if (user.credits < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${String(user.credits)}`,
      };
    }

    // 4. Verification gate — block if used more than 3000 free credits and not verified
    const creditsUsed = FREE_CREDITS_LIMIT - user.credits;
    if (!user.emailVerified && creditsUsed >= UNVERIFIED_CREDIT_THRESHOLD) {
      return {
        success: false,
        error: "VERIFICATION_REQUIRED",
      };
    }

    // 5. Generate audio
    const result = await provider.generateSpeech(options);
    if (!result.success || !result.audioUrl || !result.s3_key) {
      return { success: false, error: result.error ?? "Generation failed" };
    }

    // 6. Deduct credits
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
      select: { credits: true },
    });

    // 7. Save to DB
    const isGemini = providerType === "gemini";
    const chatterboxOpts = !isGemini
      ? (options as ChatterboxRequestOptions)
      : null;
    const geminiOpts = isGemini ? (options as GeminiRequestOptions) : null;

    const audioProject = await db.audioProject.create({
      data: {
        text: options.text,
        audioUrl: result.audioUrl,
        s3Key: result.s3_key,
        language:
          chatterboxOpts?.language ??
          (geminiOpts?.gemini_language && geminiOpts.gemini_language !== "auto"
            ? geminiOpts.gemini_language
            : detectLanguage(options.text)),
        voiceS3Key: chatterboxOpts?.voice_S3_key ?? null,
        name: "TTS",
        engine: geminiOpts?.gemini_model ?? providerType,
        exaggeration: chatterboxOpts?.exaggeration,
        cfgWeight: chatterboxOpts?.cfg_weight,
        geminiVoice: geminiOpts?.voice_name,
        geminiEmotion: geminiOpts?.gemini_emotion,
        geminiStyle: geminiOpts?.gemini_style,
        geminiPace: geminiOpts?.gemini_pace,
        creditsSpent: creditsNeeded,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      s3_key: result.s3_key,
      audioUrl: result.audioUrl,
      projectId: audioProject.id,
      creditsRemaining: updatedUser.credits,
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
}): Promise<{
  success: boolean;
  audioUrl?: string;
  s3_key?: string;
  creditsRemaining?: number;
  error?: string;
}> {
  try {
    // 1. Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // 2. Generate audio
    const result = await generateDialogueAudio({ speakers, lines, settings });
    if (
      !result.success ||
      !result.audioUrl ||
      !result.s3Key ||
      !result.fullText
    ) {
      return { success: false, error: result.error ?? "Generation failed" };
    }

    const creditsNeeded = result.creditsNeeded ?? 0;

    // 3. Credits check
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true, emailVerified: true },
    });

    if (!user) return { success: false, error: "User not found" };
    if (user.credits < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${String(user.credits)}`,
      };
    }

    // 4. Verification gate
    const creditsUsed = FREE_CREDITS_LIMIT - user.credits;
    if (!user.emailVerified && creditsUsed >= UNVERIFIED_CREDIT_THRESHOLD) {
      return {
        success: false,
        error: "VERIFICATION_REQUIRED",
      };
    }

    // 5. Deduct credits
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
      select: { credits: true },
    });

    // 6. Save to DB
    await db.audioProject.create({
      data: {
        text: result.fullText,
        audioUrl: result.audioUrl,
        s3Key: result.s3Key,
        language:
          settings.language && settings.language !== "auto"
            ? settings.language
            : detectLanguage(result.fullText),
        name: "Dialogue",
        engine: settings.model,
        geminiEmotion: speakers
          .map((s) => `${s.name}: ${s.emotion}`)
          .join(" / "),
        geminiStyle: settings.style,
        geminiPace: settings.pace,
        geminiVoice: speakers.map((s) => `${s.name}: ${s.voice}`).join(" / "),
        creditsSpent: creditsNeeded,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      audioUrl: result.audioUrl,
      s3_key: result.s3Key,
      creditsRemaining: updatedUser.credits,
    };
  } catch (error) {
    console.error("Dialogue generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

const PAGE_SIZE = 20;

export interface AudioProjectFilters {
  type?: string;
  engine?: string;
  language?: string;
  search?: string;
  sortBy?: "newest" | "oldest" | "name";
}

export async function getUserAudioProjects(
  cursor?: string,
  filters?: AudioProjectFilters,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
        audioProjects: [],
        nextCursor: null,
        totalCount: 0,
      };
    }

    const where = {
      userId: session.user.id,
      ...(filters?.type && filters.type !== "all"
        ? { name: filters.type }
        : {}),
      ...(filters?.engine && filters.engine !== "all"
        ? { engine: filters.engine }
        : {}),
      ...(filters?.language && filters.language !== "all"
        ? { language: filters.language }
        : {}),
      ...(filters?.search
        ? { text: { contains: filters.search, mode: "insensitive" as const } }
        : {}),
    };

    const orderBy =
      filters?.sortBy === "oldest"
        ? { createdAt: "asc" as const }
        : filters?.sortBy === "name"
          ? { text: "asc" as const }
          : { createdAt: "desc" as const };

    const [totalCount, audioProjects] = await Promise.all([
      db.audioProject.count({ where }),
      db.audioProject.findMany({
        where,
        orderBy,
        take: PAGE_SIZE + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
    ]);

    const hasMore = audioProjects.length > PAGE_SIZE;
    const page = hasMore ? audioProjects.slice(0, PAGE_SIZE) : audioProjects;
    const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

    return { success: true, audioProjects: page, nextCursor, totalCount };
  } catch (error) {
    console.error("Error fetching audio projects:", error);
    return {
      success: false,
      error: "Failed to fetch audio projects",
      audioProjects: [],
      nextCursor: null,
      totalCount: 0,
    };
  }
}

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

    return { success: true, credits: user.credits };
  } catch (error) {
    console.log("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
}

export async function deleteAudioProject(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await db.audioProject.findUnique({ where: { id } });

    if (project?.userId !== session.user.id) {
      return { success: false, error: "Not found or unauthorized" };
    }

    await db.audioProject.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    console.error("Error deleting audio project:", error);
    return { success: false, error: "Failed to delete audio project" };
  }
}

export type EngineGroup = "TTS" | "Dialogue" | "all";

export async function getRecentGenerations(group: EngineGroup, limit = 4) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id)
      return { success: false, error: "Unauthorized", projects: [] };

    const projects = await db.audioProject.findMany({
      where: {
        userId: session.user.id,
        // "all" → no name filter
        ...(group !== "all"
          ? { name: group === "TTS" ? "TTS" : "Dialogue" }
          : {}),
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

export async function getAudioProjectsMeta() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, totalCount: 0, languages: [], engines: [] };
    }

    const [totalCount, allProjects] = await Promise.all([
      db.audioProject.count({
        where: { userId: session.user.id },
      }),
      db.audioProject.findMany({
        where: { userId: session.user.id },
        select: { language: true, engine: true }, // only fetch what we need
      }),
    ]);

    const languages = [
      ...new Set(
        allProjects
          .map((p) => p.language)
          .filter((l): l is string => !!l && l !== "autodetect"),
      ),
    ];

    const engines = [...new Set(allProjects.map((p) => p.engine))];

    return { success: true, totalCount, languages, engines };
  } catch (error) {
    console.error("Error fetching audio projects meta:", error);
    return { success: false, totalCount: 0, languages: [], engines: [] };
  }
}
