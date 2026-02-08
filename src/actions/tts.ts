/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { cache } from "react";
import type { TTSOptions } from "./tts/providers/base-tts-provider";
import { TTSFactory, type TTSProviderType } from "./tts/tts-factory";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "~/server/db";

export async function generateSpeech(
  text: string,
  providerType: TTSProviderType,
  options: TTSOptions,
) {
  const provider = TTSFactory.getProvider(providerType);
  const result = await provider.generateSpeech(text, options);

  //   // Save to database, deduct credits, etc.
  //   await saveAudioProject(result);
  //   await deductUserCredits();

  return result;
}

export async function getUserAudioProjects(userId: string) {
  // Implementation
}

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

    return { success: true, credits: user.credits };
  } catch (error) {
    console.log("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
});

export async function deleteAudioProject(projectId: string) {
  // Implementation
}
