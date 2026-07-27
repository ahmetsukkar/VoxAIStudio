import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { S3_BUCKET_URL } from "./base-tts-provider";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadGeneratedAudio(
  buffer: Buffer,
  s3Key: string,
  contentType = "attachment",
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `${S3_BUCKET_URL}/${s3Key}`;
}
