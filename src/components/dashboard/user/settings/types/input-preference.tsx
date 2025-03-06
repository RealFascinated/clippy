import Preference from "@/components/dashboard/user/settings/types/preference";
import { SensitiveInput } from "@/components/sensitive-input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/providers/preferences-provider";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

export default function InputPreference({
  preferenceId,
  header,
  badge,
  description,
  placeholder,
  valueRegex,
}: {
  preferenceId: string;
  header: string;
  badge?: ReactNode;
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
    <Preference header={header} badge={badge} description={description}>
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
