import { notFound } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { getFileByDeleteKey, removeFile } from "@/lib/helpers/file";
import { getUserById } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
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
  if (!user) {
    return notFound;
  }

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

    Notifications.sendDeleteFileNotification(user, file);
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
