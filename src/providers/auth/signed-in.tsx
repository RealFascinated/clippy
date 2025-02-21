import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ReactNode } from "react";

type SignedInProps = {
  children: ReactNode;
};

export default async function SignedIn({ children }: SignedInProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return children;
}
