import type { UploadedVoice } from "@prisma/client";

export interface StorageProvider {
  uploadVoice(formData: FormData): Promise<UploadVoiceResult>;
  getUserUploadedVoices(): Promise<GetUserUploadedVoicesResult>;
  deleteFile(fileKey: string): Promise<void>;
  getName(): string;
}

export interface UploadVoiceResult {
  success: boolean;
  id?: string;
  s3Key?: string;
  url?: string;
  error?: string;
}

export interface GetUserUploadedVoicesResult {
  success: boolean;
  error?: string;
  voices: UploadedVoice[];
}
