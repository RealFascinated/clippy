import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_NAME: z.string(),
  },

  server: {
    MONGO_CONNECTION_STRING: z.string(),
  },

  /**
   * This is the environment variables that are available on the server.
   */
  runtimeEnv: {
    // Website
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME ?? "Clippy",

    // Mongo
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
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
});
