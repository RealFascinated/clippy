"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { cn } from "@/lib/utils/utils";
import { usePreferences } from "@/providers/preferences-provider";
import { Check, Loader2, XCircle } from "lucide-react";
import { ReactNode, useState } from "react";

const statusIcons = {
  loading: <Loader2 className="size-4 text-muted-foreground animate-spin" />,
  success: <Check className="size-4 text-green-500" />,
  failed: <XCircle className="size-4 text-destructive" />,
};

export default function PreferenceSettings({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-3">
      <BooleanPreference
        user={user}
        preferenceId="showKitty"
        header="Show Kitty"
        description="Would you like to see the little kitty running around the screen? (:"
      />
    </div>
  );
}

function BooleanPreference({
  user,
  preferenceId,
  header,
  description,
}: {
  user: UserType;
  preferenceId: string;
  header: string;
  description: string;
}) {
	const { preferences, updatePreferences } = usePreferences();
	const [value, setValue] = useState<boolean>(
		(preferences as any)?.[preferenceId] ?? false
	);
	const [status, setStatus] = useState<
		"loading" | "success" | "failed" | undefined
	>(undefined);

  const handleToggle = async (checked: boolean) => {
    setValue(checked);
    setStatus("loading");

		try {
			updatePreferences({ [preferenceId]: checked });
			setStatus("success");
		} catch (error) {
			console.error("Failed to update preference:", error);
			setValue(!checked);
			setStatus("failed");
		}
	};

  return (
    <Preference header={header} description={description} inline>
      {status && statusIcons[status]}
      <Checkbox
        checked={value}
        onCheckedChange={(checked: boolean) => handleToggle(checked)}
        disabled={status === "loading"}
      />
    </Preference>
  );
}

function Preference({
  header,
  description,
  inline,
  children,
}: {
  header: string;
  description: string;
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 justify-between",
        inline && "flex-row gap-10 items-center"
      )}
    >
      <div className="flex flex-col select-none">
        <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
          {header}
        </h1>
        <p className="max-w-md text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          {description}
        </p>
      </div>
      <div className="flex gap-2.5 items-center">{children}</div>
    </div>
  );
}
