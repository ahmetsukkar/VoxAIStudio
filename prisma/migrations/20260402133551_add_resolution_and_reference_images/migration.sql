/*
  Warnings:

  - Made the column `durationSeconds` on table `video_project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "video_project" ADD COLUMN     "referenceImageS3Keys" TEXT[],
ADD COLUMN     "referenceImageUrls" TEXT[],
ADD COLUMN     "resolution" TEXT NOT NULL DEFAULT '720p',
ALTER COLUMN "model" SET DEFAULT 'veo-3.1-generate-preview',
ALTER COLUMN "durationSeconds" SET NOT NULL,
ALTER COLUMN "durationSeconds" SET DEFAULT 8;
