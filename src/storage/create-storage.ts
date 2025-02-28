import { env } from "@/lib/env";
import DummyStorage from "./impl/dummy";
import S3Storage from "./impl/s3";
import Storage from "./storage";

function createStorage(provider: "S3"): Storage {
  switch (provider) {
    case "S3":
      return new S3Storage();
    default:
      if (process.env.NEXT_PHASE == "phase-production-build") {
        return new DummyStorage();
      }
      throw new Error(`Unknown storage provider: ${provider}`);
  }
}

// Initialize storage based on environment variable
export const storage: Storage = createStorage(env.STORAGE_PROVIDER);
