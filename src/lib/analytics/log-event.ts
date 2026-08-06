import { db } from "~/server/db";
import type { Prisma } from "@prisma/client";

export type AnalyticsEventType =
  | "QUOTA_EXCEEDED"
  | "CHECKOUT_STARTED"
  | "PURCHASE_COMPLETED";

/** Fire-and-forget analytics logging — must never break the caller's flow. */
export async function logAnalyticsEvent(
  type: AnalyticsEventType,
  userId?: string | null,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: { type, userId: userId ?? null, metadata },
    });
  } catch (error) {
    console.error(`Failed to log analytics event ${type}:`, error);
  }
}
