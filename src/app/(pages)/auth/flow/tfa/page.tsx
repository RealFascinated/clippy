import TwoFactorBorder from "@/components/user/two-factor-border";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Two-Factor Border" };

export default function TfaPage() {
  return (
    <main className="h-[calc(90dvh-var(--header-height))] flex justify-center items-center">
      <TwoFactorBorder />
    </main>
  );
}
