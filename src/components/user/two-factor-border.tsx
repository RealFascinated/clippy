"use client";

import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TwoFactorInput } from "@/components/user/two-factor-input";
import { authClient } from "@/lib/client-auth";
import { Loader2, Lock, Shield } from "lucide-react";
import { FormEvent, useState } from "react";

export default function TwoFactorBorder() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pin: string = formData.get("pin") as string;
    const trustDevice: boolean = formData.get("trust-device") === "on";
    if (!pin || pin.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);

    // Handle verifying the user's given pin
    const { error } = await authClient.twoFactor.verifyTotp({
      code: pin,
      trustDevice,
    });
    setError(error?.statusText ?? null);
    if (!error) {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div className="p-6 flex flex-col gap-3.5 bg-background/70 rounded-md border border-muted/50 select-none">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="flex gap-1.5 items-center text-xl font-bold">
          <Shield /> Two-Factor Border
        </h1>
        <p className="text-muted-foreground">
          Please enter your 6-digit code from your authenticator app to login.
        </p>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-4.5 items-center"
        onSubmit={handleVerify}
      >
        {/* Pin */}
        <TwoFactorInput />

        {/* Trust Device */}
        <SimpleTooltip content="Would you like to trust this device?">
          <div className="flex items-center gap-2">
            <Checkbox name="trust-device" />
            <Label htmlFor="trust-device">Trust this device</Label>
          </div>
        </SimpleTooltip>

        {/* Submit */}
        <Button type="submit" variant="secondary" size="xs" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Lock />}
          Login
        </Button>
      </form>

      {/* Error */}
      {error && <p className="mx-auto text-destructive">{error}</p>}
    </div>
  );
}
