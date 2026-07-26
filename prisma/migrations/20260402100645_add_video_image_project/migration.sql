-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'TIMED_OUT');

-- CreateTable
CREATE TABLE "video_project" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "prompt" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "aspectRatio" TEXT NOT NULL DEFAULT '16:9',
    "sourceImageUrl" TEXT,
    "sourceImageS3Key" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "model" TEXT NOT NULL DEFAULT 'veo-2.0-generate-001',
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "operationName" TEXT,
    "errorMessage" TEXT,
    "videoUrl" TEXT,
    "s3Key" TEXT,
    "durationSeconds" INTEGER,
    "mimeType" TEXT DEFAULT 'video/mp4',
    "creditsSpent" INTEGER,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_project" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "prompt" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "aspectRatio" TEXT NOT NULL DEFAULT '1:1',
    "style" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "model" TEXT NOT NULL DEFAULT 'imagen-3.0-generate-001',
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "imageUrl" TEXT,
    "s3Key" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT DEFAULT 'image/png',
    "creditsSpent" INTEGER,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_project_userId_idx" ON "video_project"("userId");

-- CreateIndex
CREATE INDEX "video_project_status_idx" ON "video_project"("status");

-- CreateIndex
CREATE INDEX "video_project_operationName_idx" ON "video_project"("operationName");

-- CreateIndex
CREATE INDEX "image_project_userId_idx" ON "image_project"("userId");

-- CreateIndex
CREATE INDEX "image_project_status_idx" ON "image_project"("status");

-- AddForeignKey
ALTER TABLE "video_project" ADD CONSTRAINT "video_project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_project" ADD CONSTRAINT "image_project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
