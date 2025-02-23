import { getFileById, updateFile } from "@/lib/helpers/file";
import { getFileFullName } from "@/lib/utils/file";
import { storage } from "@/storage/create-storage";
import { ApiErrorResponse } from "@/type/api/responses";
import { isbot } from "isbot";
import { NextRequest, NextResponse } from "next/server";

const notFound = NextResponse.json(
  {
    message: "File not found",
  },
  {
    status: 404,
  }
);

/**
 * Parses the range header
 *
 * @param rangeHeader the range header
 * @param fileSize the size of the file
 * @returns the start and end of the bytes to get
 */
function parseRange(rangeHeader: string, fileSize: number) {
  const [start, end] = rangeHeader.replace(/bytes=/, "").split("-");
  return {
    start: parseInt(start, 10),
    end: end ? parseInt(end, 10) : fileSize - 1,
  };
}

/**
 * Helper function to get file metadata and headers
 *
 * @param id the ID of the file
 * @returns an object containing file metadata and headers
 */
async function getFileMetadata(id: string) {
  const file = await getFileById(id);
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
  } else {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${getFileFullName(file)}"`
    );
    // Prevent caching for downloads
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return { file, fileSize, mimeType, isVideo, isImage, headers };
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiErrorResponse> | Response> {
  const { id } = await params;

  try {
    const { headers } = await getFileMetadata(id);
    return new Response(null, {
      status: 200,
      headers,
    });
  } catch (error) {
    return error as NextResponse;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiErrorResponse> | Response> {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const incrementViews = searchParams.get("incrementviews") === "true" || true;

  try {
    const { file, fileSize, mimeType, isVideo, isImage, headers } =
      await getFileMetadata(id);

    // Increment view count
    if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
      file.views++;
      await updateFile(file.id, {
        views: file.views,
      });
    }

    // Handle video streaming with range support
    const rangeHeader = request.headers.get("range");
    if (isVideo && rangeHeader) {
      const { start, end } = parseRange(rangeHeader, fileSize);
      const chunkSize = end - start + 1;
      const stream = await storage.getFileStreamRange(
        file.storageName,
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
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    // Get full object stream
    const stream = await storage.getFileStream(file.storageName);
    if (!stream) {
      throw notFound;
    }

    // Return streamed response with common headers
    return new Response(stream as any, {
      headers,
    });
  } catch (error) {
    return error as NextResponse;
  }
}
