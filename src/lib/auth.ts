import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db/drizzle";
import * as schema from "./db/schemas/auth-schema";
import { env } from "./env";
import { username } from "better-auth/plugins/username";
import { admin } from "better-auth/plugins/admin";

console.log(env);

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_WEBSITE_URL,
  advanced: {
    useSecureCookies: env.NEXT_PUBLIC_WEBSITE_URL.startsWith("https")
      ? true
      : false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    minPasswordLength: 8,
    enabled: true,
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 12,
      usernameValidator: (username) => {
        // Disallow admin
        if (username === "admin") {
          return false;
        }
        return true;
      },
    }),
    admin(),
    nextCookies(),
  ],
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
