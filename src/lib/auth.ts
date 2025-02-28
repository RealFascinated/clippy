import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { username } from "better-auth/plugins/username";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db/drizzle";
import * as schema from "./db/schemas/auth-schema";
import { env } from "./env";

/**
 * Get the current user. If the user is not
 * logged in, redirect to the main page.
 *
 * @returns the current user (wtf is the type? x.x)
 */
export const getUser = async (): Promise<Session["user"]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // This shouldn't happen
  if (!session) {
    redirect("/");
  }
  return session.user;
};

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
