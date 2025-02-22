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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiErrorResponse> | Response> {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const incrementViews = searchParams.get("incrementviews") === "true" || true;

  const file = await getFileById(id);
  if (!file) {
    return notFound;
  }

  // Increment view count
  if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
    file.views++;
    await updateFile(file.id, {
      views: file.views,
    });
  }

  const fileSize = file.size;
  const mimeType = file.mimeType || "application/octet-stream";
  const isVideo = mimeType.startsWith("video/");
  const isImage = mimeType.startsWith("image/");
  const rangeHeader = request.headers.get("range");

  // Handle video streaming with range support
  if (isVideo && rangeHeader) {
    const { start, end } = parseRange(rangeHeader, fileSize);
    const chunkSize = end - start + 1;
    const stream = await storage.getFileStreamRange(
      file.storageName,
      start,
      end
    );
    if (!stream) {
      return notFound;
    }

    // Convert stream to Response
    const response = new Response(stream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": mimeType,
      },
    });

    return response;
  }

  // Get full object stream
  const stream = await storage.getFileStream(file.storageName);
  if (!stream) {
    return notFound;
  }

  // Set common headers
  const headers = new Headers({
    "Content-Length": fileSize.toString(),
    "Content-Type": mimeType,
  });

  // Add specific headers based on file type
  if (isVideo) {
    headers.set("Accept-Ranges", "bytes");
  } else if (isImage) {
    headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
  } else {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${getFileFullName(file)}"`
    );
  }

  // Return streamed response
  return new Response(stream as any, {
    headers,
  });

  // const file = await getFileById(id);
  // let fileBytes = null;
  // if (!file || !(fileBytes = await storage.getFile(id))) {
  //   return notFound;
  // }

  // if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
  //   file.views++;
  //   await updateFile(file.id, {
  //     views: file.views,
  //   });
  // }

  // const response = new NextResponse(fileBytes);
  // // Cache for 1 hour on browsers
  // response.headers.set("Cache-Control", "max-age=3600, public");
  // response.headers.set("Content-Type", file.mimeType);

  // return response;
}
