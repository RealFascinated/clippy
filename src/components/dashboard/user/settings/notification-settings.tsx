import InputPreference from "@/components/dashboard/user/settings/types/input-preference";
import NotificationPreference from "@/components/dashboard/user/settings/types/notification-preference";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils/utils";
import { usePreferences } from "@/providers/preferences-provider";

export default function NotificationSettings() {
  const { preferences } = usePreferences();
  const hasWebhookUrl: boolean = !!preferences?.webhookUrl;

  return (
    <div className="flex flex-col gap-4">
      <NotificationPreference
        notificationId="uploadFile"
        header="File Uploads"
        description="Would you like to receive notifications for when files are uploaded?"
      />
      <NotificationPreference
        notificationId="deleteFile"
        header="File Deletions"
        description="Would you like to receive notifications for when files are deleted?"
      />
      <NotificationPreference
        notificationId="resetUploadToken"
        header="Upload Token Rotations"
        description="Would you like to receive notifications for when your upload token is rotated?"
      />
      <Separator />
      <InputPreference
        preferenceId="webhookUrl"
        header="Webhook URL"
        badge={
          <Badge
            className={cn(hasWebhookUrl && "bg-green-500")}
            variant={hasWebhookUrl ? "default" : "destructive"}
          >
            {hasWebhookUrl ? "Active" : "Inactive"}
          </Badge>
        }
        description={`The webhook URL to send ${env.NEXT_PUBLIC_WEBSITE_NAME} events to.`}
        placeholder="https://discord.com/api/webhooks/..."
        valueRegex={
          /^https:\/\/discord\.com\/api\/webhooks\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/
        }
      />
    </div>
  );
}
