import { notFound } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { getFileByDeleteKey, removeFile } from "@/lib/helpers/file";
import { dispatchWebhookEvent, getUserById } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { getFileName } from "@/lib/utils/file";
import { getFileThumbnailPath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { ApiErrorResponse, ApiSuccessResponse } from "@/type/api/responses";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  const { key } = await params;
  const file = await getFileByDeleteKey(key);
  if (!file) {
    return notFound;
  }
  const user: UserType | undefined = await getUserById(file.userId);

  try {
    const deletedFile = await storage.deleteFile(getFileName(file));
    if (!deletedFile) {
      return NextResponse.json(
        { message: "Unable to delete the file, please contact an admin" },
        { status: 500 }
      );
    }
    const deletedThubnail = await storage.deleteFile(
      getFileThumbnailPath(file.userId, file)
    );
    if (!deletedThubnail) {
      return NextResponse.json(
        { message: "Unable to delete the thumbnail, please contact an admin" },
        { status: 500 }
      );
    }
    await removeFile(file.id);

    // Dispatch webhook event
    if (user) {
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
  } catch {
    return NextResponse.json(
      {
        message:
          "An error occured when removing this file, please contact an admin",
      },
      { status: 500 }
    );
  }

  Logger.info(`The file ${getFileName(file)} was deleted`);

  return NextResponse.json(
    {
      message: "Successfully deleted",
    },
    { status: 200 }
  );
}
