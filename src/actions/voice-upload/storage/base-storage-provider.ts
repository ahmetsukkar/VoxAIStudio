export interface StorageProvider {
  uploadFile(file: File, path: string): Promise<UploadResult>;
  deleteFile(fileKey: string): Promise<void>;
  getSignedUrl(fileKey: string, expiresIn: number): Promise<string>;
  getName(): string;
}

export interface UploadResult {
  fileUrl: string;
  fileKey: string;
  provider: string;
  size: number;
}