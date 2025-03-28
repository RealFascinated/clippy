import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, twoFactor } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { username } from "better-auth/plugins/username";
import { db } from "./db/drizzle";
import * as schema from "./db/schemas/auth-schema";
import { env } from "./env";

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
    twoFactor({
      issuer: env.NEXT_PUBLIC_WEBSITE_NAME,
    }),
    admin(),
    nextCookies(),
  ],
  // session: {
  //   cookieCache: {
  //     enabled: false,
  //     maxAge: 5 * 60, // Cache duration in seconds
  //   },
  // },
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const allowRegistrations = env.NEXT_PUBLIC_ALLOW_REGISTRATIONS;

      switch (ctx.path) {
        case "/callback/:id": {
          if (!allowRegistrations) {
            throw ctx.error("BAD_REQUEST", {
              message: "Registering is currently not allowed",
            });
          }
          break;
        }
        case "/sign-up/email": {
          if (!allowRegistrations) {
            throw ctx.error("BAD_REQUEST", {
              message: "Registering is currently not allowed",
            });
          }
          break;
        }
      }
    }),
  },
});

export const toClientAuthOptions = (authOptions: BetterAuthOptions) => {
  const options: BetterAuthOptions = JSON.parse(JSON.stringify(authOptions));

  // Recursively remove any property that contains 'secret' from the entire object
  const removeSecrets = (obj: any) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase().includes("secret")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        removeSecrets(obj[key]);
      }
    }
  };

  removeSecrets(options);
  return options;
};

export type Session = typeof auth.$Infer.Session;
