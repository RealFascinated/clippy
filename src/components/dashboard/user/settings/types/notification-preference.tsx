"use client";

import Preference, {
  statusIcons,
} from "@/components/dashboard/user/settings/types/preference";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { Notifications, NotificationState } from "@/lib/db/schemas/preference";
import Logger from "@/lib/logger";
import { cn } from "@/lib/utils/utils";
import { usePreferences } from "@/providers/preferences-provider";
import { Mail, Webhook } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationPreference({
  notificationId,
  header,
  description,
}: {
  notificationId: string;
  header: string;
  description: string;
}) {
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

  return (
    <Preference header={header} description={description} inline>
      {status && statusIcons[status]}

      <SimpleTooltip content="Toggle Webhook Notifications">
        <div>
          <NotificationToggle
            notificationId={notificationId}
            header={header}
            stateId="sendWebhook"
            icon={<Webhook />}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </SimpleTooltip>
      <SimpleTooltip content="Toggle Email Notifications">
        <div>
          <NotificationToggle
            notificationId={notificationId}
            header={header}
            stateId="sendMail"
            icon={<Mail />}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </SimpleTooltip>
    </Preference>
  );
}

function NotificationToggle({
  notificationId,
  header,
  stateId,
  icon,
  status,
  setStatus,
}: {
  notificationId: string;
  header: string;
  stateId: keyof NotificationState;
  icon: ReactNode;
  status: "loading" | "success" | "failed" | undefined;
  setStatus: (status: "loading" | "success" | "failed" | undefined) => void;
}) {
  const { preferences, updatePreferences } = usePreferences();
  const notification: Notifications[keyof Notifications] =
    preferences.notifications[notificationId as keyof Notifications];
  const [state, setState] = useState<boolean>(notification[stateId]);
  const cleanNotificationName: string = header
    .toLowerCase()
    .substring(0, header.length - 1);

  const handleToggle = async () => {
    setState(!state);
    setStatus("loading");
    try {
      updatePreferences({
        notifications: {
          ...preferences.notifications,
          [notificationId]: {
            ...notification,
            [stateId]: !state,
          },
        },
      });
      setStatus("success");
    } catch (error) {
      Logger.error("Failed to update preference:", error);
      setStatus("failed");
    }
  };

  return (
    <Button
      className={cn(
        "size-8 border border-muted rounded-full",
        state && "text-primary/90 hover:text-primary"
      )}
      variant="ghost"
      disabled={status === "loading"}
      onClick={async () => {
        toast.promise(handleToggle(), {
          loading: "Saving...",
          success: () =>
            `Your ${cleanNotificationName} notifications have been ${!state ? "enabled" : "disabled"}!`,
          error: `Failed to update your ${cleanNotificationName} notifications!`,
        });
      }}
    >
      <div className={cn("*:size-6", status === "loading" && "animate-pulse")}>
        {icon}
      </div>
    </Button>
  );
}
