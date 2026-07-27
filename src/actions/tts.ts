"use server";

import type {
  TTSOptions,
  GenerateSpeechFinalResult,
} from "./tts/providers/base-tts-provider";
import { TTSFactory, type TTSProviderType } from "./tts/tts-factory";
import { getAuthSession } from "~/lib/get-session";
import { db } from "~/server/db";
import { generateDialogueAudio } from "./tts/dialogue";
import { deleteGeneratedAudio } from "./tts/providers/s3-upload-helper";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
} from "~/types/dialogue";
import { detectLanguage } from "~/lib/tts/detect-language";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";
import { UNVERIFIED_CREDIT_THRESHOLD, MAX_CHARS_ALLOWED } from "~/config/credits";
import {
  DAILY_FREE_CREDITS,
  getUserCreditSnapshot,
  selectApiKeyForUser,
  refundCredits,
} from "~/lib/credits/select-key";

async function creditsRemainingFor(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { freeCredits: true, purchasedCredits: true },
  });
  return (user?.freeCredits ?? 0) + (user?.purchasedCredits ?? 0);
}

const RETENTION_DAYS = 7;

function retentionExpiresAt(): Date {
  return new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export async function generateSpeech(
  providerType: TTSProviderType,
  options: TTSOptions,
): Promise<GenerateSpeechFinalResult> {
  try {
    // 1. Auth
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized" };

    // 2. Get provider + calculate credits needed
    const provider = TTSFactory.getProvider(providerType);
    const creditsNeeded = provider.getCredits(options);

    // 3. Global character limit — every user, free or paid, gets the same cap
    if (options.text.length > MAX_CHARS_ALLOWED) {
      return {
        success: false,
        error: `Maximum ${MAX_CHARS_ALLOWED} characters allowed per request.`,
      };
    }

    // 4. Verification gate — block if an unverified user has burned through
    // most of today's free allowance without verifying their email
    const snapshot = await getUserCreditSnapshot(session.user.id);
    if (!snapshot) return { success: false, error: "User not found" };

    const freeUsedToday = DAILY_FREE_CREDITS - snapshot.freeCredits;
    if (!snapshot.emailVerified && freeUsedToday >= UNVERIFIED_CREDIT_THRESHOLD) {
      return { success: false, error: "VERIFICATION_REQUIRED" };
    }

    // 5. Pick + reserve the key (purchased credits first, then the shared free key)
    const keySelection = await selectApiKeyForUser(session.user.id, creditsNeeded);
    if (!keySelection.ok) {
      return { success: false, error: "QUOTA_EXCEEDED" };
    }

    // 6. Generate audio
    const result = await provider.generateSpeech(options, keySelection.apiKey);
    if (!result.success || !result.audioUrl || !result.s3_key) {
      await refundCredits(session.user.id, keySelection.source, creditsNeeded);
      return { success: false, error: result.error ?? "Generation failed" };
    }

    // 7. Save to DB
    const audioProject = await db.audioProject.create({
      data: {
        text: options.text,
        audioUrl: result.audioUrl,
        s3Key: result.s3_key,
        language:
          options.gemini_language && options.gemini_language !== "auto"
            ? options.gemini_language
            : detectLanguage(options.text),
        voiceS3Key: null,
        name: "TTS",
        engine: options.gemini_model ?? providerType,
        geminiVoice: options.voice_name,
        geminiEmotion: options.gemini_emotion,
        geminiStyle: options.gemini_style,
        geminiPace: options.gemini_pace,
        promptTokens: result.promptTokens,
        audioTokens: result.audioTokens,
        creditsSpent: creditsNeeded,
        expiresAt: retentionExpiresAt(),
        userId: session.user.id,
      },
    });

    return {
      success: true,
      s3_key: result.s3_key,
      audioUrl: result.audioUrl,
      projectId: audioProject.id,
      creditsRemaining: await creditsRemainingFor(session.user.id),
    };
  } catch (error) {
    console.error("Speech generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function generateMultiSpeaker({
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
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized" };

    // 2. Input validation — fail fast, before spending anything
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

    const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
    if (totalChars > MAX_CHARS_ALLOWED) {
      return {
        success: false,
        error: `Total conversation length exceeds the maximum of ${MAX_CHARS_ALLOWED} characters. Current total: ${totalChars}.`,
      };
    }

    const creditsNeeded = calcGeminiDialogueCredits(filledLines, settings);

    // 3. Verification gate — same daily-pool anchor as single-speaker TTS
    const snapshot = await getUserCreditSnapshot(session.user.id);
    if (!snapshot) return { success: false, error: "User not found" };

    const freeUsedToday = DAILY_FREE_CREDITS - snapshot.freeCredits;
    if (!snapshot.emailVerified && freeUsedToday >= UNVERIFIED_CREDIT_THRESHOLD) {
      return { success: false, error: "VERIFICATION_REQUIRED" };
    }

    // 4. Pick + reserve the key before making the Gemini call
    const keySelection = await selectApiKeyForUser(session.user.id, creditsNeeded);
    if (!keySelection.ok) {
      return { success: false, error: "QUOTA_EXCEEDED" };
    }

    const result = await generateDialogueAudio({
      speakers,
      lines,
      settings,
      apiKey: keySelection.apiKey,
    });
    if (
      !result.success ||
      !result.audioUrl ||
      !result.s3Key ||
      !result.fullText
    ) {
      await refundCredits(session.user.id, keySelection.source, creditsNeeded);
      return { success: false, error: result.error ?? "Generation failed" };
    }

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
        promptTokens: result.promptTokens,
        audioTokens: result.audioTokens,
        creditsSpent: creditsNeeded,
        expiresAt: retentionExpiresAt(),
        userId: session.user.id,
      },
    });

    return {
      success: true,
      audioUrl: result.audioUrl,
      s3_key: result.s3Key,
      creditsRemaining: await creditsRemainingFor(session.user.id),
    };
  } catch (error) {
    console.error("Multi-Speaker generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export { generateMultiSpeaker as generateDialogue };

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
    const session = await getAuthSession();
    if (!session) {
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
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized", credits: 0 };

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { freeCredits: true, purchasedCredits: true },
    });

    if (!user) return { success: false, error: "User not found", credits: 0 };
    return { success: true, credits: user.freeCredits + user.purchasedCredits };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
}

export async function deleteAudioProject(id: string) {
  try {
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const project = await db.audioProject.findUnique({ where: { id } });
    if (project?.userId !== session.user.id) {
      return { success: false, error: "Not found or unauthorized" };
    }

    try {
      await deleteGeneratedAudio(project.s3Key);
    } catch (error) {
      // Storage delete is best-effort — an already-expired (lifecycle-deleted)
      // or legacy S3 object shouldn't block removing the DB row.
      console.error("Failed to delete storage object:", error);
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
    const session = await getAuthSession();
    if (!session)
      return { success: false, error: "Unauthorized", projects: [] };

    const projects = await db.audioProject.findMany({
      where: {
        userId: session.user.id,
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
    const session = await getAuthSession();
    if (!session) {
      return { success: false, totalCount: 0, languages: [], engines: [] };
    }

    const [totalCount, allProjects] = await Promise.all([
      db.audioProject.count({ where: { userId: session.user.id } }),
      db.audioProject.findMany({
        where: { userId: session.user.id },
        select: { language: true, engine: true },
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
