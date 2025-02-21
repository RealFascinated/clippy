import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ReactNode } from "react";

type NotSignedInProps = {
  children: ReactNode;
};

export default async function NotSignedIn({ children }: NotSignedInProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return null;
  }

  return children;
}
