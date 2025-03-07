"use client";

import BooleanPreference from "@/components/dashboard/user/settings/types/boolean-preference";
import { UserType } from "@/lib/db/schemas/auth-schema";

export default function AppearanceSettings({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-4">
      <BooleanPreference
        preferenceId="showKitty"
        header="Show Kitty"
        description="Would you like to see the little kitty running around the screen? (:"
      />
    </div>
  );
}
