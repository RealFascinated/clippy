import Preference from "@/components/dashboard/user/settings/types/preference";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreferences } from "@/providers/preferences-provider";
import { Check, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusIcons = {
  loading: <Loader2 className="size-4 text-muted-foreground animate-spin" />,
  success: <Check className="size-4 text-green-500" />,
  failed: <XCircle className="size-4 text-destructive" />,
};

export default function BooleanPreference({
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
