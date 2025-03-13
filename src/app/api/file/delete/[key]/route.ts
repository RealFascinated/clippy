import { handleApiRequest, notFound } from "@/lib/api-commons";
import ApiError from "@/lib/api-errors/api-error";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { getFileByDeleteKey, removeFile } from "@/lib/helpers/file";
import { getUserById } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
import { getFileName } from "@/lib/utils/file";
import { getFilePath, getFileThumbnailPath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const { key } = await params;
    const file = await getFileByDeleteKey(key);
    if (!file) {
      throw notFound;
    }
    const user: UserType | undefined = await getUserById(file.userId);
    if (!user) {
      throw notFound;
    }

    try {
      const deletedFile = await storage.deleteFile(
        getFilePath(file.userId, file)
      );
      if (!deletedFile) {
        throw new ApiError(
          "Unable to delete the file, please contact an admin",
          500
        );
      }
      const deletedThubnail = await storage.deleteFile(
        getFileThumbnailPath(file.userId, file)
      );
      if (!deletedThubnail) {
        throw new ApiError(
          "Unable to delete the thumbnail, please contact an admin",
          500
        );
      }
      await removeFile(file.id);

      Notifications.sendDeleteFileNotification(user, file);
    } catch {
      throw new ApiError(
        "An error occured when removing this file, please contact an admin",
        500
      );
    }

    Logger.info(`The file ${getFileName(file)} was deleted`);

    return NextResponse.json(
      {
        message: "Successfully deleted",
      },
      { status: 200 }
    );
  });
}
