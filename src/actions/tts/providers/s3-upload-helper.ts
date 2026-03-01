import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { S3_BUCKET_URL } from "./base-tts-provider";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadGeneratedAudio(
  buffer: Buffer,
  s3Key: string,
  contentType = "audio/wav",
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `${S3_BUCKET_URL}/${s3Key}`;
}
