"use client";

import BooleanPreference from "@/components/dashboard/user/settings/types/boolean-preference";
import { Separator } from "@/components/ui/separator";
import { UserType } from "@/lib/db/schemas/auth-schema";

export default function AppearanceSettings({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-4">
      <BooleanPreference
        preferenceId="showKitty"
        header="Show Kitty"
        description="Would you like to see the little kitty running around the screen? (:"
      />
      <Separator />
      <EmbedSettings />
    </div>
  );
}

function EmbedSettings() {
  return (
    <div className="relative flex flex-col gap-2">
      {/* Header */}
      <div className="flex flex-col select-none">
        <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
          Embed
        </h1>
        <p className="max-w-sm md:max-w-lg text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          How would you like to embed your files on platforms like Discord?
        </p>
      </div>

      <div className="flex flex-col">Embed Options</div>
    </div>
  );
}
