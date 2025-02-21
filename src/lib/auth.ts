import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env } from "./env";
import { db } from "./db/drizzle";
import * as schema from "./db/schemas/auth-schema";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_WEBSITE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    additionalFields: {
      /**
       * The users upload token.
       */
      uploadToken: {
        type: "string",
        required: false,
      },
    },
  },
});
export type Session = typeof auth.$Infer.Session;
