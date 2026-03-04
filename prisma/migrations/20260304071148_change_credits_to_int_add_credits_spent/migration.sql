/*
  Warnings:

  - You are about to alter the column `credits` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "audio_project" ADD COLUMN     "creditsSpent" INTEGER;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "credits" SET DEFAULT 5000,
ALTER COLUMN "credits" SET DATA TYPE INTEGER;
