import { db } from "~/server/db";

export type SignupTrendPoint = { date: string; count: number };

export async function getSignupTrend(days = 30): Promise<SignupTrendPoint[]> {
  const rows = await db.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT gs::date AS date, COALESCE(COUNT(u.id), 0) AS count
    FROM generate_series(CURRENT_DATE - (${days}::int - 1), CURRENT_DATE, interval '1 day') AS gs
    LEFT JOIN "user" u ON date_trunc('day', u."createdAt") = gs
    GROUP BY gs
    ORDER BY gs
  `;
  return rows.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    count: Number(r.count),
  }));
}

export type ActivationStats = {
  totalUsers: number;
  activatedUsers: number;
  activationRate: number;
  medianHoursToFirstGeneration: number | null;
};

export async function getActivationStats(): Promise<ActivationStats> {
  const totalUsers = await db.user.count();
  const activatedUsers = await db.user.count({
    where: { audioProjects: { some: {} } },
  });

  const medianRows = await db.$queryRaw<{ median_hours: number | null }[]>`
    SELECT percentile_cont(0.5) WITHIN GROUP (
      ORDER BY EXTRACT(EPOCH FROM (ap.first_gen - u."createdAt")) / 3600
    ) AS median_hours
    FROM "user" u
    JOIN (
      SELECT "userId", MIN("createdAt") AS first_gen
      FROM audio_project
      GROUP BY "userId"
    ) ap ON ap."userId" = u.id
  `;

  return {
    totalUsers,
    activatedUsers,
    activationRate: totalUsers === 0 ? 0 : activatedUsers / totalUsers,
    medianHoursToFirstGeneration: medianRows[0]?.median_hours ?? null,
  };
}

export type RetentionStats = {
  windowDays: number;
  eligibleUsers: number;
  returnedUsers: number;
  retentionRate: number;
}[];

export async function getRetention(): Promise<RetentionStats> {
  const rows = await db.$queryRaw<
    {
      eligible_d1: bigint;
      returned_d1: bigint;
      eligible_d7: bigint;
      returned_d7: bigint;
      eligible_d30: bigint;
      returned_d30: bigint;
    }[]
  >`
    SELECT
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '1 day') AS eligible_d1,
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '1 day' AND EXISTS (
        SELECT 1 FROM "session" s WHERE s."userId" = u.id AND s."createdAt" >= u."createdAt" + INTERVAL '1 day'
      )) AS returned_d1,
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '7 days') AS eligible_d7,
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '7 days' AND EXISTS (
        SELECT 1 FROM "session" s WHERE s."userId" = u.id AND s."createdAt" >= u."createdAt" + INTERVAL '7 days'
      )) AS returned_d7,
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '30 days') AS eligible_d30,
      COUNT(*) FILTER (WHERE u."createdAt" <= NOW() - INTERVAL '30 days' AND EXISTS (
        SELECT 1 FROM "session" s WHERE s."userId" = u.id AND s."createdAt" >= u."createdAt" + INTERVAL '30 days'
      )) AS returned_d30
    FROM "user" u
  `;

  const r = rows[0];
  if (!r) return [];

  const windows: { windowDays: number; eligible: bigint; returned: bigint }[] = [
    { windowDays: 1, eligible: r.eligible_d1, returned: r.returned_d1 },
    { windowDays: 7, eligible: r.eligible_d7, returned: r.returned_d7 },
    { windowDays: 30, eligible: r.eligible_d30, returned: r.returned_d30 },
  ];

  return windows.map((w) => {
    const eligibleUsers = Number(w.eligible);
    const returnedUsers = Number(w.returned);
    return {
      windowDays: w.windowDays,
      eligibleUsers,
      returnedUsers,
      retentionRate: eligibleUsers === 0 ? 0 : returnedUsers / eligibleUsers,
    };
  });
}

export type UsageDepthBucket = { bucket: string; users: number };

const USAGE_BUCKET_ORDER = ["0", "1", "2-5", "6-20", "20+"];

export async function getUsageDepth(): Promise<UsageDepthBucket[]> {
  const rows = await db.$queryRaw<{ bucket: string; users: bigint }[]>`
    SELECT bucket, COUNT(*) AS users FROM (
      SELECT
        u.id,
        CASE
          WHEN COUNT(ap.id) = 0 THEN '0'
          WHEN COUNT(ap.id) = 1 THEN '1'
          WHEN COUNT(ap.id) BETWEEN 2 AND 5 THEN '2-5'
          WHEN COUNT(ap.id) BETWEEN 6 AND 20 THEN '6-20'
          ELSE '20+'
        END AS bucket
      FROM "user" u
      LEFT JOIN audio_project ap ON ap."userId" = u.id
      GROUP BY u.id
    ) sub
    GROUP BY bucket
  `;

  const byBucket = new Map(rows.map((r) => [r.bucket, Number(r.users)]));
  return USAGE_BUCKET_ORDER.map((bucket) => ({
    bucket,
    users: byBucket.get(bucket) ?? 0,
  }));
}

export type ConversionFunnel = {
  signedUp: number;
  generated: number;
  quotaExceeded: number;
  checkoutStarted: number;
  purchased: number;
};

export async function getConversionFunnel(): Promise<ConversionFunnel> {
  const signedUp = await db.user.count();
  const generated = await db.user.count({
    where: { audioProjects: { some: {} } },
  });

  const eventRows = await db.$queryRaw<{ type: string; users: bigint }[]>`
    SELECT type, COUNT(DISTINCT "userId") AS users
    FROM analytics_event
    WHERE "userId" IS NOT NULL
    GROUP BY type
  `;

  const byType = new Map(eventRows.map((r) => [r.type, Number(r.users)]));

  return {
    signedUp,
    generated,
    quotaExceeded: byType.get("QUOTA_EXCEEDED") ?? 0,
    checkoutStarted: byType.get("CHECKOUT_STARTED") ?? 0,
    purchased: byType.get("PURCHASE_COMPLETED") ?? 0,
  };
}

export type AtRiskUser = {
  id: string;
  email: string;
  signedUpAt: Date;
  quotaHitAt: Date;
  lastActiveAt: Date | null;
  generations: number;
};

export async function getAtRiskUsers(): Promise<AtRiskUser[]> {
  const rows = await db.$queryRaw<
    {
      id: string;
      email: string;
      signed_up_at: Date;
      quota_hit_at: Date;
      last_active_at: Date | null;
      generations: bigint;
    }[]
  >`
    WITH quota_hit AS (
      SELECT "userId", MIN("createdAt") AS hit_at
      FROM analytics_event
      WHERE type = 'QUOTA_EXCEEDED' AND "userId" IS NOT NULL
      GROUP BY "userId"
    ),
    purchased AS (
      SELECT DISTINCT "userId" FROM analytics_event
      WHERE type = 'PURCHASE_COMPLETED' AND "userId" IS NOT NULL
    ),
    last_active AS (
      SELECT "userId", MAX("createdAt") AS last_seen FROM "session" GROUP BY "userId"
    ),
    gen_count AS (
      SELECT "userId", COUNT(*) AS cnt FROM audio_project GROUP BY "userId"
    )
    SELECT
      u.id, u.email,
      u."createdAt" AS signed_up_at,
      qh.hit_at AS quota_hit_at,
      la.last_seen AS last_active_at,
      COALESCE(gc.cnt, 0) AS generations
    FROM "user" u
    JOIN quota_hit qh ON qh."userId" = u.id
    LEFT JOIN purchased p ON p."userId" = u.id
    LEFT JOIN last_active la ON la."userId" = u.id
    LEFT JOIN gen_count gc ON gc."userId" = u.id
    WHERE p."userId" IS NULL
      AND (la.last_seen IS NULL OR la.last_seen < NOW() - INTERVAL '7 days')
    ORDER BY qh.hit_at DESC
    LIMIT 100
  `;

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    signedUpAt: r.signed_up_at,
    quotaHitAt: r.quota_hit_at,
    lastActiveAt: r.last_active_at,
    generations: Number(r.generations),
  }));
}
