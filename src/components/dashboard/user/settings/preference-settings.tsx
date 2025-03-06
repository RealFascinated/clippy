"use client";

import { SensitiveInput } from "@/components/sensitive-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { cn } from "@/lib/utils/utils";
import { usePreferences } from "@/providers/preferences-provider";
import { Check, Loader2, XCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const statusIcons = {
  loading: <Loader2 className="size-4 text-muted-foreground animate-spin" />,
  success: <Check className="size-4 text-green-500" />,
  failed: <XCircle className="size-4 text-destructive" />,
};

export default function PreferenceSettings({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-4">
      <BooleanPreference
        preferenceId="showKitty"
        header="Show Kitty"
        description="Would you like to see the little kitty running around the screen? (:"
      />
      <InputPreference
        preferenceId="webhookUrl"
        header="Webhook URL"
        description="The webhook URL to send Clippy events to."
        placeholder="https://discord.com/api/webhooks/..."
        valueRegex={
          /^https:\/\/discord\.com\/api\/webhooks\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/
        }
      />
    </div>
  );
}

function BooleanPreference({
  preferenceId,
  header,
  description,
}: {
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

  // Clear the status after some time
  useEffect(() => {
    if (status && status !== "loading") {
      const timer = setTimeout(() => setStatus(undefined), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
        onCheckedChange={async (checked: boolean) => {
          toast.promise(handleToggle(checked), {
            loading: "Saving...",
            success: () =>
              `Your ${header} has been ${checked ? "enabled" : "disabled"}!`,
            error: `Failed to update your ${header} preference!`,
          });
        }}
        disabled={status === "loading"}
      />
    </Preference>
  );
}

function InputPreference({
  preferenceId,
  header,
  description,
  placeholder,
  valueRegex,
}: {
  preferenceId: string;
  header: string;
  description: string;
  placeholder: string;
  valueRegex?: RegExp;
}) {
  const { preferences, updatePreferences } = usePreferences();
  const initialValue: string = (preferences as any)?.[preferenceId] ?? "";
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | undefined
  >(undefined);
  const [value, setValue] = useState<string>(initialValue);
  const dirty: boolean = value !== initialValue;
  const isValueValid: boolean = !value || !valueRegex || valueRegex.test(value);

  // Clear the status after some time
  useEffect(() => {
    if (status && status !== "loading") {
      const timer = setTimeout(() => setStatus(undefined), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSave = async () => {
    if (!dirty || !isValueValid) return;
    setStatus("loading");
    try {
      updatePreferences({ [preferenceId]: value });
      setStatus("success");
    } catch (err) {
      console.error("Failed to update preference:", err);
      setStatus("failed");
    }
  };

  return (
    <Preference header={header} description={description}>
      <form
        className="w-full flex gap-0 items-center"
        onSubmit={async (event) => {
          event.preventDefault();
          toast.promise(handleSave(), {
            loading: "Saving...",
            success: () => `Your ${header} has been updated!`,
            error: `Failed to update your ${header} preference!`,
          });
        }}
      >
        <SensitiveInput
          className="rounded-r-none"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event: any) => setValue(event.target.value)}
        />
        <Button
          className="rounded-l-none"
          type="submit"
          disabled={!dirty || status === "loading" || !isValueValid}
        >
          Save
        </Button>
      </form>
    </Preference>
  );
}

function Preference({
  className,
  header,
  description,
  inline,
  children,
}: {
  className?: string;
  header: string;
  description: string;
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 justify-between",
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
      <div className={cn("flex gap-2.5 items-center", className)}>
        {children}
      </div>
    </div>
  );
}
