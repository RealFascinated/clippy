import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";
import type { auth } from "./auth";
import { env } from "./env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_WEBSITE_URL,
  plugins: [
    usernameClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        redirect("/auth/flow/tfa");
      },
    }),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
