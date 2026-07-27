import type { StorageProvider } from "./storage/base-storage-provider";
import { R2StorageProvider } from "./storage/r2-storage-provider";

export type StorageProviderType = 'r2'; // | 'gcp' | 'azure';

export class StorageFactory {
  static getProvider(providerType: StorageProviderType): StorageProvider {
    switch (providerType) {
      case 'r2':
        return new R2StorageProvider();
    //   case 'gcp':
    //     return new GCPStorageProvider();
    //   case 'azure':
    //     return new AzureStorageProvider();
      default:
        throw new Error(`Unknown storage provider: ${providerType as string}`);
    }
  }
}