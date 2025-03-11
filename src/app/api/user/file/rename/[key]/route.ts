import { handleApiRequestWithUser, notFound } from "@/lib/api-commons";
import ApiError from "@/lib/api-errors/api-error";
import { FileType } from "@/lib/db/schemas/file";
import { ThumbnailType } from "@/lib/db/schemas/thumbnail";
import { env } from "@/lib/env";
import { getFileById, updateFile } from "@/lib/helpers/file";
import { getUserRole, roles } from "@/lib/helpers/role";
import { getThumbnailById, updateThumbnail } from "@/lib/helpers/thumbnail";
import Logger from "@/lib/logger";
import { getFileName } from "@/lib/utils/file";
import { getFilePath, getFileThumbnailPath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    if (getUserRole(user) !== roles.admin) {
      return NextResponse.json(
        { message: "You do not have permission to rename this file." },
        { status: 403 }
      );
    }

    const { key } = await params;
    const file = await getFileById(key);
    if (!file) {
      throw notFound;
    }

    const { id } = await request.json();
    if (!id) {
      throw new ApiError("The id is required.", 400);
    }

    if (id.length > env.FILE_ID_LENGTH) {
      throw new ApiError("The id is too long.", 400);
    }

    if ((await getFileById(id)) !== undefined) {
      throw new ApiError("The id is already taken.", 400);
    }

    // Rename the file
    await updateFile(file.id, { id: id });
    await storage.renameFile(
      getFilePath(file.userId, file),
      getFilePath(file.userId, {
        ...file,
        id: id,
      } as FileType)
    );

    // Rename the thumbnail if it exists
    if (file.hasThumbnail) {
      const thumbnail = await getThumbnailById(file.id);
      await storage.renameFile(
        getFileThumbnailPath(file.userId, thumbnail),
        getFileThumbnailPath(file.userId, {
          ...thumbnail,
          id: id,
        } as ThumbnailType)
      );
      await updateThumbnail(file.id, { id: id });
    }
    Logger.info(
      `The file ${getFileName(file)} had its id changed to ${id}.${file.extension} by ${user.username}`
    );

    return NextResponse.json(
      {
        message: "Successfully renamed",
      },
      { status: 200 }
    );
  });
}
