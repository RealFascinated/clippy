import { db } from "@/lib/db/drizzle";
import { fileTable, FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { getUserByUploadToken } from "@/lib/helpers/user";
import { getThumbnail } from "@/lib/thumbmail";
import { getFilePath, getFileThumbnailPath } from "@/lib/utils/paths";
import { randomString } from "@/lib/utils/utils";
import { storage } from "@/storage/create-storage";
import { NextResponse } from "next/server";

interface FileData {
  name: string;
  type: string;
  size: number;
  content: Uint8Array;
}

interface SuccessResponse {
  /**
   * The path to the uploaded file.
   */
  path: string;

  /**
   * The url of this Clippy instance.
   */
  url: string;

  /**
   * The url to delete the file.
   */
  deletionUrl: string;

  /**
   * The url to the thumbmail.
   */
  thumbnailUrl?: string;
}

interface ErrorResponse {
  message: string;
}

/**
 * Processes a single file upload and returns structured file data
 */
async function processFile(file: File): Promise<FileData> {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    // @ts-ignore
    content: await file.bytes(),
  };
}

/**
 * Handles file uploads from ShareX
 * @param request The incoming request containing form data
 */
export async function POST(
  request: Request
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const formData = await request.formData();
    const uploadToken: string | undefined = formData.get("token")?.toString();
    if (!uploadToken) {
      return NextResponse.json(
        { message: "No upload token was provided" },
        { status: 401 }
      );
    }
    const user = await getUserByUploadToken(uploadToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid upload token" },
        { status: 401 }
      );
    }

    const files = formData.getAll("sharex");

    // Validate if files exist
    if (!files.length) {
      return NextResponse.json(
        { message: "No files were uploaded" },
        { status: 400 }
      );
    }

    // Validate file types
    if (!files.every((file) => file instanceof File)) {
      return NextResponse.json(
        { message: "Invalid file format" },
        { status: 400 }
      );
    }

    const file = await processFile(files[0]);
    const id = randomString(8);
    const extension = file.name.split(".")[1];
    const name = `${id}.${extension}`;
    const mimeType = file.type;
    const deleteKey = randomString(32);
    const fileBuffer = Buffer.from(file.content);

    const fileMeta: FileType = {
      id: id,
      views: 0,
      deleteKey: deleteKey,
      size: file.size,
      mimeType: file.type,
      extension: extension,
      createdAt: new Date(),
      userId: user.id,

      // Thumbnail
      thumbnailId: null,
      thumbnailExtension: null,
      thumbnailSize: null,
    };

    if (mimeType.startsWith("image") || mimeType.startsWith("video")) {
      const thumbnailId = randomString(16);
      const thumbnailName = `${thumbnailId}.webp`;
      const thumbnail = await getThumbnail(name, fileBuffer, mimeType);

      fileMeta.thumbnailId = thumbnailId;
      fileMeta.thumbnailExtension = "webp";
      fileMeta.thumbnailSize = thumbnail.size;

      const savedThumbnail = await storage.saveFile(
        getFileThumbnailPath(user.id, fileMeta),
        thumbnail.buffer
      );
      if (!savedThumbnail) {
        await storage.deleteFile(thumbnailName);
        return NextResponse.json(
          { message: "An error occured whilst generating the thumbnail" },
          { status: 500 }
        );
      }
    }

    const savedFile = await storage.saveFile(
      getFilePath(user.id, fileMeta),
      fileBuffer
    );
    if (!savedFile) {
      await storage.deleteFile(name);
      return NextResponse.json(
        { message: "An error occured whilst saving your file" },
        { status: 500 }
      );
    }

    await db.insert(fileTable).values(fileMeta);

    return NextResponse.json({
      path: name,
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/file/delete/${fileMeta.deleteKey}`,
      ...(fileMeta.thumbnailId
        ? {
            thumbnailUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/thumbnail/${fileMeta.thumbnailId}.${fileMeta.thumbnailExtension}`,
          }
        : {}),
    });
  } catch (error) {
    console.error("Error processing file upload:", error);

    return NextResponse.json(
      {
        message:
          "Failed to upload your file, please contact an admin if this keeps occuring",
      },
      { status: 500 }
    );
  }
}

// Configuration for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};
