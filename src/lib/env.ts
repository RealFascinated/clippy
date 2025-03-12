import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

declare global {
  interface Window {
    __ENV: {
      [key: string]: string;
    };
  }
}

// const readVariable = (key: string) => {
//   if (typeof window === "undefined") return process.env[key];
//   return window.__ENV[key];
// };

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_NAME: z.string(),
    NEXT_PUBLIC_WEBSITE_DESCRIPTION: z.string(),
    NEXT_PUBLIC_WEBSITE_LOGO: z.string(),
    NEXT_PUBLIC_WEBSITE_URL: z.string(),
  },

  shared: {
    NEXT_PUBLIC_APP_ENV: z.string(),
    NEXT_PUBLIC_ALLOW_REGISTRATIONS: z.boolean().optional().default(true),
  },

  server: {
    // Database
    DATABASE_URL: z.string(),

    // Better Auth
    BETTER_AUTH_SECRET: z.string(),

    // Storage Provider
    STORAGE_PROVIDER: z.enum(["S3", "LOCAL"]),

    // Local Storage
    STORAGE_LOCAL_PATH: z.string().optional(),

    // S3 Storage
    STORAGE_S3_ENDPOINT: z.string().optional(),
    STORAGE_S3_PORT: z.number().optional(),
    STORAGE_S3_USE_SSL: z.boolean().optional(),
    STORAGE_S3_ACCESS_KEY: z.string().optional(),
    STORAGE_S3_SECRET_KEY: z.string().optional(),
    STORAGE_S3_BUCKET: z.string().optional(),

    // File Upload
    ALLOWED_MIME_TYPES: z.string().optional(),
    FILE_ID_LENGTH: z.number().optional().default(8),
    COMPRESS_IMAGES: z.boolean().optional().default(true),

    // Short URL
    SHORT_URL_LENGTH: z.number().optional().default(6),

    // Misc
    LOG_LEVEL: z
      .enum(["debug", "info", "warn", "error"])
      .optional()
      .default("info"),
  },

  runtimeEnv: {
    // Client
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    NEXT_PUBLIC_WEBSITE_DESCRIPTION:
      process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION,
    NEXT_PUBLIC_WEBSITE_LOGO: process.env.NEXT_PUBLIC_WEBSITE_LOGO,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,

    // Shared
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_ALLOW_REGISTRATIONS:
      process.env.NEXT_PUBLIC_ALLOW_REGISTRATIONS === "true",

    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH,
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
    STORAGE_S3_PORT: Number(process.env.STORAGE_S3_PORT),
    STORAGE_S3_USE_SSL: process.env.STORAGE_S3_USE_SSL === "true",
    STORAGE_S3_ACCESS_KEY: process.env.STORAGE_S3_ACCESS_KEY,
    STORAGE_S3_SECRET_KEY: process.env.STORAGE_S3_SECRET_KEY,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,
    ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES,
    FILE_ID_LENGTH: Number(process.env.FILE_ID_LENGTH ?? 8),
    COMPRESS_IMAGES: process.env.COMPRESS_IMAGES === "true",
    SHORT_URL_LENGTH: Number(process.env.SHORT_URL_LENGTH ?? 6),
    LOG_LEVEL: (process.env.LOG_LEVEL ?? "info").toLowerCase(),
  },

  clientPrefix: "NEXT_PUBLIC_",
  emptyStringAsUndefined: true,
  skipValidation: true,
});
