import { fileExceedsUploadLimit, handleApiRequest } from "@/lib/api-commons";
import ApiError from "@/lib/api-errors/api-error";
import { env } from "@/lib/env";
import { uploadFile } from "@/lib/helpers/file";
import { getUserRole } from "@/lib/helpers/role";
import { getUserByUploadToken } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
import { getFileName } from "@/lib/utils/file";
import { validateMimeType } from "@/lib/utils/mime";
import { formatBytes, randomString } from "@/lib/utils/utils";
import { thumbnailQueue } from "@/queue/queues";
import { NextResponse } from "next/server";
import Sharp from "sharp";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const COMPRESS_PERCENTAGE_MIN = 50;
const COMPRESS_PERCENTAGE_MAX = 100;
export const COMPRESS_PERCENTAGE_DEFAULT = 90;

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

/**
 * Processes a single file upload and returns structured file data
 */
async function processFile(file: File): Promise<FileData> {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    content: new Uint8Array(await file.arrayBuffer()),
  };
}

/**
 * Extracts upload token and compression percentage from form data
 *
 * @param formData the form data to extract options from
 * @returns the upload token and compression percentage
 */
function getOptions(formData: FormData): {
  uploadToken: string;
  compressPercentage: number;
} {
  const uploadToken: string | undefined = formData
    .get("x-clippy-upload-token")
    ?.toString();
  if (!uploadToken) {
    throw new ApiError("No upload token was provided", 400);
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
    throw new ApiError(
      `Invalid compress percentage: ${compressPercentage} (must be between ${COMPRESS_PERCENTAGE_MIN} and ${COMPRESS_PERCENTAGE_MAX})`,
      400
    );
  }

  return { uploadToken, compressPercentage };
}

/**
 * Checks if a file size exceeds the allowed limits
 *
 * @param size the size to check in bytes
 * @param role the user's role with upload limits
 */
function checkFileSizeLimit(size: number, role: { uploadLimit: number }) {
  // Check global file size limit first
  if (size > MAX_FILE_SIZE) {
    throw fileExceedsUploadLimit(MAX_FILE_SIZE);
  }

  // Then check role-specific limit if it exists
  if (role.uploadLimit !== -1 && size > role.uploadLimit) {
    throw fileExceedsUploadLimit(role.uploadLimit);
  }
}

/**
 * Handles file uploads from ShareX
 *
 * @param request The incoming request containing form data
 */
export async function POST(request: Request): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const contentLength = request.headers.get("content-length");
    const formData = await request.formData();
    const { uploadToken, compressPercentage } = getOptions(formData);

    const user = await getUserByUploadToken(uploadToken);
    if (!user) {
      throw new ApiError("Invalid upload token", 401);
    }

    const role = getUserRole(user);

    // Check content length before processing if available
    if (contentLength) {
      checkFileSizeLimit(parseInt(contentLength), role);
    }

    const files = formData.getAll("sharex");
    if (!files.length) {
      throw new ApiError("No files were uploaded", 400);
    }

    // Validate file types
    if (!files.every((file) => file instanceof File)) {
      throw new ApiError("Invalid file format", 400);
    }

    const file = await processFile(files[0]);
    if (!validateMimeType(file.type)) {
      throw new ApiError(`The mime-type "${file.type}" is not allowed`, 400);
    }

    const fileId = randomString(env.FILE_ID_LENGTH);
    let content = Buffer.from(file.content);

    // Check actual file size
    checkFileSizeLimit(file.size, role);

    // Image compression
    if (
      env.COMPRESS_IMAGES && // Compression is enabled
      file.type.startsWith("image/") && // Is an image
      file.size > 1024 * 100 && // Larger than 100KB
      !file.type.startsWith("image/gif") // ignore gifs
    ) {
      const before = Date.now();
      // Compress image using streaming
      const compressedContent = Buffer.from(
        await Sharp(content).webp({ quality: compressPercentage }).toBuffer()
      );

      // Check if the new file is significantly different in size (more than 10%)
      const sizeDifference = Math.abs(compressedContent.length - file.size) / file.size;
      if (sizeDifference < 0.1) {
        Logger.info(
          `Compressed file size difference is less than 10%, using original file. (${formatBytes(file.size)} vs ${formatBytes(compressedContent.length)}, difference: ${(sizeDifference * 100).toFixed(1)}%)`
        );
      } else if (compressedContent.length > file.size) {
        Logger.info(
          `Compressed file is larger than original file, using original file. (${formatBytes(file.size)} vs ${formatBytes(content.length)})`
        );
      } else {
        file.type = "image/webp";
        const nameParts = file.name.split(".");
        nameParts.pop();
        file.name = `${nameParts.join(".")}.webp`;

        Logger.info(
          `Compressed file "${fileId}.webp" (before: ${formatBytes(file.size)}, after: ${formatBytes(content.length)}, took: ${Date.now() - before}ms)`
        );
        content = compressedContent;
      }
    }

    const fileMeta = await uploadFile(
      fileId,
      file.name,
      content.length,
      content,
      file.type,
      user
    );

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      thumbnailQueue.add(fileMeta);
    }

    Notifications.sendUploadFileNotification(user, fileMeta);
    return NextResponse.json(
      {
        path: getFileName(fileMeta),
        url: env.NEXT_PUBLIC_WEBSITE_URL,
        deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/file/delete/${fileMeta.deleteKey}`,
      } as SuccessResponse,
      { status: 200 }
    );
  });
}

// Configuration for the API route
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    maxDuration: 60,
  },
};
