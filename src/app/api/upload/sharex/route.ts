import { db } from "@/lib/db/drizzle";
import { fileTable } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { getUserByUploadToken } from "@/lib/helpers/user";
import { getThumbnail } from "@/lib/thumbmail";
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
    if (!files.every(file => file instanceof File)) {
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

    console.log(mimeType);

    let thumbnailData:
      | {
          id: string;
          name: string;
          size: number;
        }
      | undefined = undefined;
    if (mimeType.startsWith("image") || mimeType.startsWith("video")) {
      const thumbnailId = randomString(16);
      const thumbnailName = `${thumbnailId}.webp`;
      const thumbnail = await getThumbnail(name, fileBuffer, mimeType);

      const savedThumbnail = await storage.saveFile(
        thumbnailName,
        thumbnail.buffer
      );
      if (!savedThumbnail) {
        await storage.deleteFile(thumbnailName);
        return NextResponse.json(
          { message: "An error occured whilst generating the thumbnail" },
          { status: 500 }
        );
      }

      thumbnailData = {
        id: thumbnailId,
        name: thumbnailName,
        size: thumbnail.size,
      };
    }

    const savedFile = await storage.saveFile(name, fileBuffer);
    if (!savedFile) {
      await storage.deleteFile(name);
      return NextResponse.json(
        { message: "An error occured whilst saving your file" },
        { status: 500 }
      );
    }

    const values = {
      id: id,
      views: 0,
      deleteKey: deleteKey,
      size: file.size,
      mimeType: file.type,
      extension: extension,
      createdAt: new Date(),
      userId: user.id,

      // Thumbnail
      thumbnailId: thumbnailData?.id,
      thumbnailExtension: thumbnailData
        ? thumbnailData.name.split(".")[1]
        : undefined,
      thumbnailSize: thumbnailData?.size,
    };

    await db.insert(fileTable).values(values);

    return NextResponse.json({
      path: name,
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/file/delete/${values.deleteKey}`,
      ...(values.thumbnailId
        ? {
            thumbnailUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/thumbnail/${values.thumbnailId}.${values.thumbnailExtension}`,
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
