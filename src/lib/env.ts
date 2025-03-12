import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import Logger from "./logger";

declare global {
  interface Window {
    __ENV: {
      [key: string]: string;
    };
  }
}

/**
 * Gets the environment variable from the client or server
 *
 * @param env the environment variable to get
 * @returns the environment variable
 */
function getClientEnv(env: string) {
  if (typeof window !== "undefined" && window.__ENV) {
    Logger.info(`Getting client env: ${env}`);
    return window.__ENV[env];
  }
  Logger.info(`Getting server env: ${env}`);
  return process.env[env];
}

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

  /**
   * This is the environment variables that are available on the server.
   */
  runtimeEnv: {
    /**
     * Client
     */
    NEXT_PUBLIC_WEBSITE_NAME:
      getClientEnv("NEXT_PUBLIC_WEBSITE_NAME") ?? "Clippy",
    NEXT_PUBLIC_WEBSITE_DESCRIPTION:
      getClientEnv("NEXT_PUBLIC_WEBSITE_DESCRIPTION") ??
      "Open Source ShareX Uploader.",
    NEXT_PUBLIC_WEBSITE_LOGO:
      getClientEnv("NEXT_PUBLIC_WEBSITE_LOGO") ?? "/logo.png",
    NEXT_PUBLIC_WEBSITE_URL:
      getClientEnv("NEXT_PUBLIC_WEBSITE_URL") ?? "http://localhost:3000",

    /**
     * Shared
     */
    NEXT_PUBLIC_APP_ENV: getClientEnv("NEXT_PUBLIC_APP_ENV") ?? "development",
    NEXT_PUBLIC_ALLOW_REGISTRATIONS:
      getClientEnv("NEXT_PUBLIC_ALLOW_REGISTRATIONS") === "true",

    /**
     * Server
     */

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Better Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // Storage Provider
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,

    // Local Storage
    STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH,

    // S3 Storage
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
    STORAGE_S3_PORT: Number(process.env.STORAGE_S3_PORT),
    STORAGE_S3_USE_SSL: process.env.STORAGE_S3_USE_SSL === "true",
    STORAGE_S3_ACCESS_KEY: process.env.STORAGE_S3_ACCESS_KEY,
    STORAGE_S3_SECRET_KEY: process.env.STORAGE_S3_SECRET_KEY,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,

    // File Upload
    ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES,
    FILE_ID_LENGTH: Number(process.env.FILE_ID_LENGTH ?? 8),
    COMPRESS_IMAGES: process.env.COMPRESS_IMAGES === "true",

    // Short URL
    SHORT_URL_LENGTH: Number(process.env.SHORT_URL_LENGTH ?? 6),

    // Misc
    LOG_LEVEL: (process.env.LOG_LEVEL ?? "info").toLowerCase(),
  },

  /**
   * This is the prefix for the environment variables that are available on the client.
   */
  clientPrefix: "NEXT_PUBLIC_",

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * Skip validation during production build.
   */
  skipValidation: true,
});
