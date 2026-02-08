// 'use server'

// import { StorageFactory, type StorageProviderType } from "./voice-upload/storage-factory";



// export async function uploadVoice(
//   file: File,
//   userId: string,
//   storageProvider: StorageProviderType = 'aws' // Default provider
// ) {
//   const storage = StorageFactory.getProvider(storageProvider);
//   const path = `voices/${userId}/${Date.now()}-${file.name}`;
  
//   const result = await storage.uploadFile(file, path);
  
// //   // Save metadata to database
// //   await saveVoiceMetadata({
// //     userId,
// //     fileUrl: result.fileUrl,
// //     fileKey: result.fileKey,
// //     provider: result.provider,
// //     size: result.size
// //   });
  
//   return result;
// }

// export async function getUserUploadedVoices(userId: string) {
//   // Fetch from database
// }