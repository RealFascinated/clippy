import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_NAME: z.string(),
    NEXT_PUBLIC_WEBSITE_URL: z.string(),
  },

  server: {
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),

    STORAGE_PROVIDER: z.enum(["S3"]),

    STORAGE_S3_ENDPOINT: z.string(),
    STORAGE_S3_PORT: z.number(),
    STORAGE_S3_USE_SSL: z.boolean(),
    STORAGE_S3_ACCESS_KEY: z.string(),
    STORAGE_S3_SECRET_KEY: z.string(),
    STORAGE_S3_BUCKET: z.string(),

    ALLOWED_MIME_TYPES: z.string(),
  },

  /**
   * This is the environment variables that are available on the server.
   */
  runtimeEnv: {
    // Website
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME ?? "Clippy",
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,

    // Postgres
    DATABASE_URL: process.env.DATABASE_URL,

    // Better Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,

    // File Storage
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
    STORAGE_S3_PORT: Number(process.env.STORAGE_S3_PORT),
    STORAGE_S3_USE_SSL: process.env.STORAGE_S3_USE_SSL === "true",
    STORAGE_S3_ACCESS_KEY: process.env.STORAGE_S3_ACCESS_KEY,
    STORAGE_S3_SECRET_KEY: process.env.STORAGE_S3_SECRET_KEY,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,

    // Allowed file types
    ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES,
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

  skipValidation: true,
});
