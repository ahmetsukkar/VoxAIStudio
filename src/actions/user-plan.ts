"use server";

import { db } from "~/server/db";
import { getAuthSession } from "~/lib/get-session";

export interface UserPlanStatus {
  isFreeTrial: boolean;
  trialExpired: boolean;
  trialExpiresAt: string | null;
}

export async function getUserPlanStatus(): Promise<{
  success: boolean;
  plan?: UserPlanStatus;
  error?: string;
}> {
  try {
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized" };

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
