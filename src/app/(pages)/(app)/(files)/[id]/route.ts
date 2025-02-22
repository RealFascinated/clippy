import { getFileById, updateFile } from "@/lib/helpers/file";
import { getFileFullName } from "@/lib/utils/file";
import { storage } from "@/storage/create-storage";
import { ApiErrorResponse } from "@/type/api/responses";
import { isbot } from "isbot";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

const notFound = NextResponse.json(
  {
    message: "File not found",
  },
  {
    status: 404,
  }
);

// Helper function to convert Node.js Readable stream to Web ReadableStream
function readableToWebReadableStream(readable: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readable.on("data", (chunk) => controller.enqueue(chunk));
      readable.on("end", () => controller.close());
      readable.on("error", (err) => controller.error(err));
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<unknown | ApiErrorResponse>> {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const incrementViews = searchParams.get("incrementviews") === "true" || true;

  const file = await getFileById(id);
  if (!file) {
    return notFound;
  }

  // Use getFileStream to handle the file stream
  const fileStream: Readable | null = await storage.getFileStream(id);

  if (!fileStream) {
    return notFound;
  }

  if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
    file.views++;
    await updateFile(file.id, {
      views: file.views,
    });
  }

  // Convert Node.js Readable stream to Web ReadableStream
  const webReadableStream = readableToWebReadableStream(fileStream);

  // Create a NextResponse from the Web ReadableStream
  const response = new NextResponse(webReadableStream);

  // Cache for 1 hour on browsers
  response.headers.set("Cache-Control", "max-age=3600, public");
  response.headers.set("Content-Type", file.mimeType);
  response.headers.set(
    "Content-Disposition",
    `inline; filename="${getFileFullName(file)}"`
  );

  return response;
}
