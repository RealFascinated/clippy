import { fileExceedsUploadLimit } from "@/lib/api-commons";
import { FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { uploadFileStream } from "@/lib/helpers/file";
import { getUserRole } from "@/lib/helpers/role";
import { getUserByUploadToken } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
import { getFileName } from "@/lib/utils/file";
import { validateMimeType } from "@/lib/utils/mime";
import { readableStreamToNodeStream } from "@/lib/utils/stream";
import { formatBytes, randomString } from "@/lib/utils/utils";
import { thumbnailQueue } from "@/queue/queues";
import { ApiErrorResponse } from "@/type/api/responses";
import { NextResponse } from "next/server";
import Sharp from "sharp";

const COMPRESS_PERCENTAGE_MIN = 50;
const COMPRESS_PERCENTAGE_MAX = 100;
export const COMPRESS_PERCENTAGE_DEFAULT = 90;

interface FileData {
  name: string;
  type: string;
  size: number;
  stream: ReadableStream<Uint8Array>;
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

/**
 * Processes a single file upload and returns structured file data
 */
async function processFile(file: File): Promise<FileData> {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    stream: file.stream(),
  };
}

function getOptions(formData: FormData): {
  uploadToken: string;
  compressPercentage: number;
} {
  const uploadToken: string | undefined = formData
    .get("x-clippy-upload-token")
    ?.toString();
  if (!uploadToken) {
    throw new Error("No upload token was provided");
  }

  const compressPercentageString: string | undefined = formData
    .get("x-clippy-compress-percentage")
    ?.toString();
  let compressPercentage: number | undefined = compressPercentageString
    ? parseInt(compressPercentageString)
    : undefined;
  if (!compressPercentage) {
    // Default compression percentage
    compressPercentage = COMPRESS_PERCENTAGE_DEFAULT;
  }
  if (
    compressPercentage < COMPRESS_PERCENTAGE_MIN ||
    compressPercentage > COMPRESS_PERCENTAGE_MAX
  ) {
    throw new Error(
      `Invalid compress percentage: ${compressPercentage} (must be between ${COMPRESS_PERCENTAGE_MIN} and ${COMPRESS_PERCENTAGE_MAX})`
    );
  }

  return { uploadToken, compressPercentage };
}

/**
 * Handles file uploads from ShareX
 * @param request The incoming request containing form data
 */
export async function POST(
  request: Request
): Promise<NextResponse<SuccessResponse | ApiErrorResponse>> {
  try {
    const formData = await request.formData();
    const { uploadToken, compressPercentage } = getOptions(formData);

    const user = await getUserByUploadToken(uploadToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid upload token" },
        { status: 401 }
      );
    }

    const files = formData.getAll("sharex");
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

    let fileMeta: FileType;
    try {
      const file = await processFile(files[0]);
      if (!validateMimeType(file.type)) {
        return NextResponse.json(
          { message: `The mime-type "${file.type}" is not allowed` },
          { status: 400 }
        );
      }

      const fileId = randomString(env.FILE_ID_LENGTH);

      // Check upload limit before processing
      const role = getUserRole(user);
      if (role.uploadLimit !== -1 && file.size > role.uploadLimit) {
        throw fileExceedsUploadLimit;
      }

      const nodeStream = readableStreamToNodeStream(file.stream);

      // Image compression
      if (
        env.COMPRESS_IMAGES && // Compression is enabled
        file.type.startsWith("image/") && // Is an image
        file.size > 51200 && // Larger than 50kb
        !file.type.startsWith("image/gif") // ignore gifs
      ) {
        const before = Date.now();

        // Create a transform stream for compression
        const transformer = Sharp().webp({ quality: compressPercentage });

        // Use streaming for compression
        const compressedStream = nodeStream.pipe(transformer);

        // For compressed images, we need to change the file type and extension
        const nameParts = file.name.split(".");
        nameParts.pop();
        const newName = `${nameParts.join(".")}.webp`;

        // Upload the compressed stream
        fileMeta = await uploadFileStream(
          fileId,
          newName,
          file.size, // We'll use original size as an estimate, actual size will be different
          compressedStream,
          "image/webp",
          user
        );

        Logger.info(
          `Compressed file "${fileId}.webp" (original size: ${formatBytes(file.size)}, took: ${Date.now() - before}ms)`
        );
      } else {
        // Upload the original file stream directly
        fileMeta = await uploadFileStream(
          fileId,
          file.name,
          file.size,
          nodeStream,
          file.type,
          user
        );
      }

      // Add to thumbnail queue
      thumbnailQueue.add(fileMeta);

      Notifications.sendUploadFileNotification(user, fileMeta);
    } catch (err) {
      return NextResponse.json(
        {
          message: (err as Error).message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      path: getFileName(fileMeta),
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/file/delete/${fileMeta.deleteKey}`,
    });
  } catch (error) {
    console.error("Error processing file upload:", error);

    return NextResponse.json(
      {
        message:
          (error as Error).message ??
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
