"use server";

import {
  StorageFactory,
  type StorageProviderType,
} from "./voice-upload/storage-factory";

export async function uploadVoice(
  storageProvider: StorageProviderType = "r2", // Default provider
  formData: FormData,
) {
  const provider = StorageFactory.getProvider(storageProvider);
  const result = await provider.uploadVoice(formData);

  return result;
}

export async function getUserUploadedVoices(
  storageProvider: StorageProviderType = "r2",
) {
  const provider = StorageFactory.getProvider(storageProvider);
  const result = await provider.getUserUploadedVoices();

  return result;
}
