/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
//"use server"

import type {
  GetUserUploadedVoicesResult,
  StorageProvider,
  UploadVoiceResult,
} from "./base-storage-provider";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "~/lib/auth";
import { headers } from "next/headers";

import { env } from "~/env";
import { db } from "~/server/db";
import { cache } from "react";

const s3Client = new S3Client({
  region: env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export class AWSStorageProvider implements StorageProvider {
  async uploadVoice(formData: FormData): Promise<UploadVoiceResult> {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
      }

      if (
        !env.AWS_ACCESS_KEY_ID ||
        !env.AWS_SECRET_ACCESS_KEY ||
        !env.AWS_S3_BUCKET_NAME
      ) {
        return { success: false, error: "AWS S3 not configured" };
      }

      const file = formData.get("voice") as File;

      if (!file) {
        return { success: false, error: "No file provided" };
      }

      if (!file.type.startsWith("audio/")) {
        return { success: false, error: "File must be audio" };
      }

      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: "File must be under 10MB" };
      }

      const fileExtension = file.name.split(".").pop();

      const fileName = `voices/${session.user.id}/${Date.now()}.${fileExtension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.AWS_S3_BUCKET_NAME ?? "",
          Key: fileName,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
        }),
      );

      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: env.AWS_S3_BUCKET_NAME ?? "",
          Key: fileName,
        }),
        { expiresIn: 3600 * 24 * 7 },
      );

      const uploadedVoice = await db.uploadedVoice.create({
        data: {
          name: file.name,
          s3Key: fileName,
          url: signedUrl,
          userId: session.user.id,
        },
      });
      return {
        success: true,
        id: uploadedVoice.id,
        s3Key: fileName,
        url: signedUrl,
      };
    } catch (error) {
      console.error("Voice upload error:", error);
      return { success: false, error: "Failed to upload voice file" };
    }
  }

  getUserUploadedVoices = cache(
    async (): Promise<GetUserUploadedVoicesResult> => {
      try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session?.user?.id) {
          return { success: false, error: "Unauthorized", voices: [] };
        }

        const uploadedVoices = await db.uploadedVoice.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        });

        return { success: true, voices: uploadedVoices };
      } catch (error) {
        console.error("Error fetching uploaded voices:", error);
        return {
          success: false,
          error: "Failed to fetch uploaded voices",
          voices: [],
        };
      }
    },
  );

  deleteFile(fileKey: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getName(): string {
    return "aws";
  }

}
