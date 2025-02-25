import { notFound } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { getFileById, updateFile } from "@/lib/helpers/file";
import { getUserById } from "@/lib/helpers/user";
import { getFileName } from "@/lib/utils/file";
import { getFilePath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { isbot } from "isbot";
import { NextRequest, NextResponse } from "next/server";

/**
 * Parses the range header to get the start and end of the bytes to get
 * @param rangeHeader The range header string
 * @param fileSize The size of the file in bytes
 */
function parseRange(
  rangeHeader: string,
  fileSize: number
): { start: number; end: number } {
  const [start, end] = rangeHeader.replace(/bytes=/, "").split("-");
  return {
    start: parseInt(start, 10),
    end: end ? parseInt(end, 10) : fileSize - 1,
  };
}

/**
 * Gets the file metadata for the file
 *
 * @param fileId The ID of the file
 * @returns the file metadata
 */
async function getFileMetadata(
  fileId: string,
  download?: boolean
): Promise<{
  fileMeta: FileType;
  user: UserType;
  isVideo: boolean;
  isImage: boolean;
  headers: Headers;
}> {
  const fileMeta = await getFileById(fileId);
  if (!fileMeta) {
    throw notFound;
  }
  const user = await getUserById(fileMeta.userId);

  const fileSize = fileMeta.size;
  const mimeType = fileMeta.mimeType || "application/octet-stream";
  const isVideo = mimeType.startsWith("video/");
  const isImage = mimeType.startsWith("image/");

  // Set common headers
  const headers = new Headers({
    "Content-Length": fileSize.toString(),
    "Content-Type": mimeType,
  });

  // Add specific headers based on file type
  if (isVideo) {
    headers.set("Accept-Ranges", "bytes");
  } else if (isImage) {
    headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
  }

  // Download file, or is not image and is not video
  if (download || (!isVideo && !isImage)) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${getFileName(fileMeta)}"`
    );
    // Prevent caching for downloads
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return { fileMeta, user, isVideo, isImage, headers };
}

/**
 * Helper function to handle video streaming with range support
 * @param request The NextRequest object
 * @param fileId The ID of the file
 */
async function getRangeResponse(
  request: NextRequest,
  user: UserType,
  fileId: string
): Promise<Response> {
  const { fileMeta } = await getFileMetadata(fileId);
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) {
    throw notFound;
  }

  const { start, end } = parseRange(rangeHeader, fileMeta.size);
  const chunkSize = end - start + 1;
  const stream = await storage.getFileStreamRange(
    getFilePath(user.id, fileMeta),
    start,
    end
  );
  if (!stream) {
    throw notFound;
  }

  return new Response(stream as any, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${fileMeta.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": fileMeta.mimeType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;

  try {
    const { headers } = await getFileMetadata(id);
    return new Response(null, { status: 200, headers });
  } catch (error) {
    return error as NextResponse;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const incrementViews = searchParams.get("incrementviews") === "true" || true;
  const download = searchParams.get("download") === "true" || false;

  try {
    const { fileMeta, user, isVideo, headers } = await getFileMetadata(
      id,
      download
    );

    // Increment view count
    if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
      fileMeta.views++;
      await updateFile(fileMeta.id, { views: fileMeta.views });
    }

    // Download the file
    if (download) {
      // Get full object stream
      const stream = await storage.getFileStream(
        getFilePath(user.id, fileMeta)
      );
      if (!stream) {
        throw notFound;
      }

      return new Response(stream as any, { headers: headers });
    }

    // Handle video streaming with range support
    if (isVideo && request.headers.get("range")) {
      return getRangeResponse(request, user, id);
    }

    // Get full object stream
    const stream = await storage.getFileStream(getFilePath(user.id, fileMeta));
    if (!stream) {
      throw notFound;
    }

    // Return streamed response with common headers
    return new Response(stream as any, { headers: headers });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      console.error(error);
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
