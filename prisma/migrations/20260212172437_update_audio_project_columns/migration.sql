/*
  Warnings:

  - Added the required column `engine` to the `audio_project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audio_project" ADD COLUMN     "cfgWeight" DOUBLE PRECISION,
ADD COLUMN     "engine" TEXT NOT NULL,
ADD COLUMN     "exaggeration" DOUBLE PRECISION;
