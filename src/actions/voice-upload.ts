"use server";

import {
  StorageFactory,
  type StorageProviderType,
} from "./voice-upload/storage-factory";

export async function uploadVoice(
  storageProvider: StorageProviderType = "aws", // Default provider
  formData: FormData,
) {
  const provider = StorageFactory.getProvider(storageProvider);
  const result = await provider.uploadVoice(formData);

  return result;
}

export async function getUserUploadedVoices(
  storageProvider: StorageProviderType = "aws",
) {
  const provider = StorageFactory.getProvider(storageProvider);
  const result = await provider.getUserUploadedVoices();

  return result;
}
