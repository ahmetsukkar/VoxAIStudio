"use server";

import { getAuthSession } from "~/lib/get-session";
import { logAnalyticsEvent } from "~/lib/analytics/log-event";
import type { PlanSlug } from "~/config/plans";

export async function logCheckoutStarted(slug: PlanSlug): Promise<void> {
  const session = await getAuthSession();
  if (!session?.user) return;

  await logAnalyticsEvent("CHECKOUT_STARTED", session.user.id, { slug });
}
