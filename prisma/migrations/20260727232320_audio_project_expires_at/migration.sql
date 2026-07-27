-- AlterTable
ALTER TABLE "audio_project" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- Backfill: legacy rows (pre-dating this column) are treated as already
-- past their 7-day retention window, since nothing has been enforcing it.
UPDATE "audio_project" SET "expiresAt" = "createdAt" + INTERVAL '7 days' WHERE "expiresAt" IS NULL;
