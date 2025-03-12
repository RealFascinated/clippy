import { z } from "zod";

declare global {
  interface Window {
    __ENV: {
      [key: string]: string;
    };
  }
}

/**
 * Get the environment variable for the client
 *
 * @param env the environment variable to get
 * @returns the environment variable
 */
function getClientEnv(env: string) {
  if (typeof window !== "undefined" && window.__ENV) {
    return window.__ENV[env];
  }
  return process.env[env];
}

// Define the schema for client-side environment variables
const clientSchema = z.object({
  NEXT_PUBLIC_WEBSITE_NAME: z.string(),
  NEXT_PUBLIC_WEBSITE_DESCRIPTION: z.string(),
  NEXT_PUBLIC_WEBSITE_LOGO: z.string(),
  NEXT_PUBLIC_WEBSITE_URL: z.string(),
});

// Define the schema for shared environment variables
const sharedSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.string(),
  NEXT_PUBLIC_ALLOW_REGISTRATIONS: z.boolean().optional().default(true),
});

// Define the schema for server-side environment variables
const serverSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  STORAGE_PROVIDER: z.enum(["S3", "LOCAL"]),
  STORAGE_LOCAL_PATH: z.string().optional(),
  STORAGE_S3_ENDPOINT: z.string().optional(),
  STORAGE_S3_PORT: z.number().optional(),
  STORAGE_S3_USE_SSL: z.boolean().optional(),
  STORAGE_S3_ACCESS_KEY: z.string().optional(),
  STORAGE_S3_SECRET_KEY: z.string().optional(),
  STORAGE_S3_BUCKET: z.string().optional(),
  ALLOWED_MIME_TYPES: z.string().optional(),
  FILE_ID_LENGTH: z.number().optional().default(8),
  COMPRESS_IMAGES: z.boolean().optional().default(true),
  SHORT_URL_LENGTH: z.number().optional().default(6),
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .optional()
    .default("info"),
});

// Client-side environment type
const clientEnvSchema = z.object({
  ...clientSchema.shape,
  ...sharedSchema.shape,
});

// Server-side environment type (includes all variables)
const serverEnvSchema = z.object({
  ...clientSchema.shape,
  ...sharedSchema.shape,
  ...serverSchema.shape,
});

// Validate and export the environment configuration
const processEnv = {
  // Client
  NEXT_PUBLIC_WEBSITE_NAME:
    getClientEnv("NEXT_PUBLIC_WEBSITE_NAME") ?? "Clippy",
  NEXT_PUBLIC_WEBSITE_DESCRIPTION:
    getClientEnv("NEXT_PUBLIC_WEBSITE_DESCRIPTION") ??
    "Open Source ShareX Uploader.",
  NEXT_PUBLIC_WEBSITE_LOGO:
    getClientEnv("NEXT_PUBLIC_WEBSITE_LOGO") ?? "/logo.png",
  NEXT_PUBLIC_WEBSITE_URL:
    getClientEnv("NEXT_PUBLIC_WEBSITE_URL") ?? "http://localhost:3000",

  // Shared
  NEXT_PUBLIC_APP_ENV: getClientEnv("NEXT_PUBLIC_APP_ENV") ?? "development",
  NEXT_PUBLIC_ALLOW_REGISTRATIONS:
    getClientEnv("NEXT_PUBLIC_ALLOW_REGISTRATIONS") === "true",
};

// Add server-side environment variables only when running on the server
if (typeof window === "undefined") {
  Object.assign(processEnv, {
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
  });
}

// Export the environment with the appropriate type based on runtime context
export const env = (
  typeof window === "undefined" ? serverEnvSchema : clientEnvSchema
).parse(processEnv);

// Export types for type safety
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type Env = typeof env;
