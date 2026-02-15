import type { StorageProvider } from "./storage/base-storage-provider";
import { AWSStorageProvider } from "./storage/aws-storage-provider";

export type StorageProviderType = 'aws'; // | 'gcp' | 'azure';

export class StorageFactory {
  static getProvider(providerType: StorageProviderType): StorageProvider {
    switch (providerType) {
      case 'aws':
        return new AWSStorageProvider();
    //   case 'gcp':
    //     return new GCPStorageProvider();
    //   case 'azure':
    //     return new AzureStorageProvider();
      default:
        throw new Error(`Unknown storage provider: ${providerType as string}`);
    }
  }
}