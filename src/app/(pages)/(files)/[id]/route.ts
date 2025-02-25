import { notFound } from "@/lib/api-commons";
import { FileType } from "@/lib/db/schemas/file";
import { getFileById, updateFile } from "@/lib/helpers/file";
import { getFileName } from "@/lib/utils/file";
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
  file: FileType;
  fileSize: number;
  mimeType: string;
  isVideo: boolean;
  isImage: boolean;
  headers: Headers;
}> {
  const file = await getFileById(fileId);
  if (!file) {
    throw notFound;
  }

  const fileSize = file.size;
  const mimeType = file.mimeType || "application/octet-stream";
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
      `attachment; filename="${getFileName(file)}"`
    );
    // Prevent caching for downloads
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return { file, fileSize, mimeType, isVideo, isImage, headers };
}

/**
 * Helper function to handle video streaming with range support
 * @param request The NextRequest object
 * @param fileId The ID of the file
 */
async function getRangeResponse(
  request: NextRequest,
  fileId: string
): Promise<Response> {
  const { file, fileSize, mimeType } = await getFileMetadata(fileId);
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) {
    throw notFound;
  }

  const { start, end } = parseRange(rangeHeader, fileSize);
  const chunkSize = end - start + 1;
  const stream = await storage.getFileStreamRange(
    `${file.id}.${file.extension}`,
    start,
    end
  );
  if (!stream) {
    throw notFound;
  }

  return new Response(stream as any, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": mimeType,
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
  const { id: fileId } = await params;

  try {
    const { headers } = await getFileMetadata(fileId);
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
    const { file, isVideo, headers } = await getFileMetadata(id, download);

    // Increment view count
    if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
      file.views++;
      await updateFile(file.id, { views: file.views });
    }

    // Download the file
    if (download) {
      // Get full object stream
      const stream = await storage.getFileStream(getFileName(file));
      if (!stream) {
        throw notFound;
      }

      return new Response(stream as any, { headers: headers });
    }

    // Handle video streaming with range support
    if (isVideo && request.headers.get("range")) {
      return getRangeResponse(request, id);
    }

    // Get full object stream
    const stream = await storage.getFileStream(getFileName(file));
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
