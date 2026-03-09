-- AlterTable
ALTER TABLE "user" ADD COLUMN     "trialExpiresAt" TIMESTAMP(3),
ALTER COLUMN "credits" SET DEFAULT 10000;
