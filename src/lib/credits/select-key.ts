import { db } from "~/server/db";
import { env } from "~/env";

// Placeholder daily allowance — revisit once Phase 3's real Gemini TTS
// free-tier quota is confirmed (PLAN.md §2, open question #3).
export const DAILY_FREE_CREDITS = 500;

export type KeySource = "free" | "paid";

export type KeySelectionResult =
  | { ok: true; apiKey: string; source: KeySource }
  | { ok: false; error: "QUOTA_EXCEEDED" };

function isNewUtcDay(refreshedAt: Date, now: Date): boolean {
  return (
    refreshedAt.getUTCFullYear() !== now.getUTCFullYear() ||
    refreshedAt.getUTCMonth() !== now.getUTCMonth() ||
    refreshedAt.getUTCDate() !== now.getUTCDate()
  );
}

async function ensureDailyRefill(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { freeCreditsRefreshedAt: true },
  });
  if (!user) return;

  const now = new Date();
  if (isNewUtcDay(user.freeCreditsRefreshedAt, now)) {
    await db.user.update({
      where: { id: userId },
      data: { freeCredits: DAILY_FREE_CREDITS, freeCreditsRefreshedAt: now },
    });
  }
}

/**
 * Picks which Gemini project key serves a generation and reserves the cost
 * against that balance up front — the key is chosen before the request and
 * never switched mid-request. Purchased credits are spent first; once they
 * run out (or were never bought), the request falls back to the shared free
 * key, subject to the same daily cap as every other free user.
 */
export async function selectApiKeyForUser(
  userId: string,
  cost: number,
): Promise<KeySelectionResult> {
  await ensureDailyRefill(userId);

  const paidReserved = await db.$executeRaw`
    UPDATE "user" SET "purchasedCredits" = "purchasedCredits" - ${cost}
    WHERE id = ${userId} AND "purchasedCredits" >= ${cost}
  `;
  if (paidReserved > 0) {
    return { ok: true, apiKey: env.PaidAPIKey, source: "paid" };
  }

  const freeReserved = await db.$executeRaw`
    UPDATE "user" SET "freeCredits" = "freeCredits" - ${cost}
    WHERE id = ${userId} AND "freeCredits" >= ${cost}
  `;
  if (freeReserved > 0) {
    return { ok: true, apiKey: env.FreeAPIKey, source: "free" };
  }

  return { ok: false, error: "QUOTA_EXCEEDED" };
}

/** Ensures the daily refill has run, then returns the caller's current balances. */
export async function getUserCreditSnapshot(userId: string) {
  await ensureDailyRefill(userId);
  return db.user.findUnique({
    where: { id: userId },
    select: { freeCredits: true, purchasedCredits: true, emailVerified: true },
  });
}

/** Returns a reservation after a failed generation (the provider call errored out). */
export async function refundCredits(
  userId: string,
  source: KeySource,
  cost: number,
): Promise<void> {
  if (source === "paid") {
    await db.$executeRaw`UPDATE "user" SET "purchasedCredits" = "purchasedCredits" + ${cost} WHERE id = ${userId}`;
  } else {
    await db.$executeRaw`UPDATE "user" SET "freeCredits" = "freeCredits" + ${cost} WHERE id = ${userId}`;
  }
}
