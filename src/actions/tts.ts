/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server";

import type { TTSOptions } from "./tts/providers/base-tts-provider";
import { TTSFactory, type TTSProviderType } from "./tts/tts-factory";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "~/server/db";

export async function generateSpeech(
  providerType: TTSProviderType,
  options: TTSOptions,
) {
  const provider = TTSFactory.getProvider(providerType);
  const result = await provider.generateSpeech(options);

  //   // Save to database, deduct credits, etc.
  //   await saveAudioProject(result);
  //   await deductUserCredits();

  return result;
}

export async function calculateCredit(
  providerType: TTSProviderType,
  charCount: number,
) {
  const provider = TTSFactory.getProvider(providerType);
  const result = provider.calculateExactPoints(charCount);

  return result;
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

export const getUserCredits = cache(async () => {
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
});


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
