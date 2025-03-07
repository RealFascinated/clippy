import NotificationPreference from "@/components/dashboard/user/settings/types/notification-preference";

export default function NotificationSettings() {
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
    </div>
  );
}
