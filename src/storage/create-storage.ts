import { env } from "@/lib/env";
import DummyStorage from "./impl/dummy";
import LocalStorage from "./impl/local";
import S3Storage from "./impl/s3";
import Storage from "./storage";

/**
 * Creates a storage instance based on the provider.
 *
 * @param provider the provider to use
 * @returns the storage instance
 */
function createStorage(provider: typeof env.STORAGE_PROVIDER): Storage {
  switch (provider) {
    case "S3":
      return new S3Storage();
    case "LOCAL":
      return new LocalStorage();
    default:
      if (process.env.NEXT_PHASE == "phase-production-build") {
        return new DummyStorage();
      }
      throw new Error(`Unknown storage provider: ${provider}`);
  }
}

// Initialize storage based on environment variable
export const storage: Storage = createStorage(env.STORAGE_PROVIDER);
