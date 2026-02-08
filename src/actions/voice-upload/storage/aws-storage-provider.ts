// import { S3Client } from '@aws-sdk/client-s3';
// import type { StorageProvider, UploadResult } from './base-storage-provider';
// import { env } from 'process';

// export class AWSStorageProvider implements StorageProvider {
//   private s3Client: S3Client;
  
//   constructor() {
//     this.s3Client = new S3Client({ region: env.AWS_REGION });
//   }
//     deleteFile(fileKey: string): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     getSignedUrl(fileKey: string, expiresIn: number): Promise<string> {
//         throw new Error('Method not implemented.');
//     }
  
//   async uploadFile(file: File, path: string): Promise<UploadResult> {
//     // AWS S3 upload logic
//   }
  
//   getName(): string { return 'aws'; }
// }

// // // actions/voice-upload/storage/gcp-storage-provider.ts
// // export class GCPStorageProvider implements StorageProvider {
// //   async uploadFile(file: File, path: string): Promise<UploadResult> {
// //     // Google Cloud Storage logic
// //   }
  
// //   getName(): string { return 'gcp'; }
// // }

// // // actions/voice-upload/storage/azure-storage-provider.ts
// // export class AzureStorageProvider implements StorageProvider {
// //   async uploadFile(file: File, path: string): Promise<UploadResult> {
// //     // Azure Blob Storage logic
// //   }
  
// //   getName(): string { return 'azure'; }
// // }