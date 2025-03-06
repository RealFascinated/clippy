import { UserType } from "./db/schemas/auth-schema";
import { FileType } from "./db/schemas/file";
import { formatBytes } from "./utils/utils";
import { env } from "./env";
import { dispatchWebhookEvent } from "./helpers/user";
import { getFileName } from "./utils/file";

/**
 * Send a notification to the user when a file is uploaded.
 *
 * @param user The user to send the notification to.
 * @param file The file that was uploaded.
 */
async function sendUploadFileNotification(user: UserType, file: FileType) {
  // Send webhook if enabled
  if (!user.preferences.notifications.uploadFile.sendWebhook) {
    await dispatchWebhookEvent(user, {
      title: "File Uploaded",
      description: `A file for \`${user.name}\` has been uploaded:`,
      color: 0x55ff55,
      fields: [
        {
          name: "File Name",
          value: `\`${getFileName(file)}\``,
          inline: true,
        },
        {
          name: "Original File Name",
          value: `\`${file.originalName ?? "Unknown"}\``,
          inline: true,
        },
        {
          name: "Type",
          value: `\`${file.mimeType}\``,
          inline: true,
        },
        {
          name: "Size",
          value: `\`${formatBytes(file.size)}\``,
          inline: false,
        },
      ],
      image: {
        url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${getFileName(file)}`,
      },
    });
  }
}

/**
 * Send a notification to the user when a file is deleted.
 *
 * @param user The user to send the notification to.
 * @param file The file that was deleted.
 */
async function sendDeleteFileNotification(user: UserType, file: FileType) {
  // Send webhook if enabled
  if (user.preferences.notifications.deleteFile.sendWebhook) {
    await dispatchWebhookEvent(user, {
      title: "File Deleted",
      description: `A file for \`${user.name}\` has been deleted:`,
      color: 0xaa0000,
      fields: [
        {
          name: "File Name",
          value: `\`${getFileName(file)}\``,
          inline: true,
        },
        {
          name: "Original File Name",
          value: `\`${file.originalName ?? "Unknown"}\``,
          inline: true,
        },
        {
          name: "Type",
          value: `\`${file.mimeType}\``,
          inline: true,
        },
        {
          name: "Uploaded",
          value: `<t:${Math.floor(file.createdAt.getTime() / 1000)}:R>`,
          inline: true,
        },
      ],
    });
  }
}

/**
 * Send a notification to the user when their upload token is reset.
 *
 * @param user The user to send the notification to.
 */
async function sendResetUploadTokenNotification(user: UserType) {
  // Send webhook if enabled
  if (user.preferences.notifications.resetUploadToken.sendWebhook) {
    await dispatchWebhookEvent(user, {
      title: "Upload Token Reset",
      description: `The upload token for \`${user.name}\` has been reset.`,
    });
  }
}
export const Notifications = {
  sendUploadFileNotification,
  sendDeleteFileNotification,
  sendResetUploadTokenNotification,
};
