import { db } from "@/lib/db/drizzle";
import { fileTable } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { getUserByUploadToken } from "@/lib/helpers/user";
import { getFileExtension, randomString } from "@/lib/utils";
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
        { message: "Unknown upload token" },
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
    const name = `${id}.${getFileExtension(file.type)}`;

    const deleteKey = randomString(32);

    await db.insert(fileTable).values({
      id: id,
      views: 0,
      deleteKey: deleteKey,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date(),
      storageName: name,
      userId: user.id,
    });

    const saved = await storage.saveFile(name, Buffer.from(file.content));
    if (!saved) {
      return NextResponse.json(
        { message: "An error occured whilst saving your file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path: name,
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/file/delete/${deleteKey}`,
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
