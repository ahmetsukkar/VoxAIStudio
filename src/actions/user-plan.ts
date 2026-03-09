"use server";

import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "~/server/db";

export interface UserPlanStatus {
  isFreeTrial: boolean;    // true = on active 7-day trial
  trialExpired: boolean;   // true = trial has ended, no paid plan yet
  trialExpiresAt: string | null; // ISO string for display
}

export async function getUserPlanStatus(): Promise<{
  success: boolean;
  plan?: UserPlanStatus;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { trialExpiresAt: true },
    });

    if (!user) return { success: false, error: "User not found" };

    const now = new Date();
    const trialExpiresAt = user.trialExpiresAt;

    const isFreeTrial = trialExpiresAt !== null && now <= trialExpiresAt;
    const trialExpired = trialExpiresAt !== null && now > trialExpiresAt;

    return {
      success: true,
      plan: {
        isFreeTrial,
        trialExpired,
        trialExpiresAt: trialExpiresAt?.toISOString() ?? null,
      },
    };
  } catch (error) {
    console.error("Error fetching plan status:", error);
    return { success: false, error: "Failed to fetch plan status" };
  }
}
