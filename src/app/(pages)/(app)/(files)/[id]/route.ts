import { getFileById, updateFile } from "@/lib/helpers/file";
import { getFileFullName } from "@/lib/utils/file";
import { storage } from "@/storage/create-storage";
import { ApiErrorResponse } from "@/type/api/responses";
import { isbot } from "isbot";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

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
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  // Handle range requests
  const range = request.headers.get("range");
  if (range) {
    // Parse range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1;
    const chunkSize = end - start + 1;

    // Get partial content stream
    const fileStream = await storage.getFileStreamRange(id, start, end); // You'll need to add this method

    if (!fileStream) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Convert to web readable stream
    const webReadableStream = readableToWebReadableStream(fileStream);

    // Create response with partial content
    const response = new NextResponse(webReadableStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${file.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": file.mimeType,
        "Content-Disposition": `inline; filename="${getFileFullName(file)}"`,
        "Cache-Control": "max-age=3600, public",
      },
    });

    return response;
  }

  // Handle non-range requests as before
  const fileStream = await storage.getFileStream(id);
  if (!fileStream) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
    file.views++;
    await updateFile(file.id, { views: file.views });
  }

  const webReadableStream = readableToWebReadableStream(fileStream);
  const response = new NextResponse(webReadableStream);

  response.headers.set("Cache-Control", "max-age=3600, public");
  response.headers.set("Content-Type", file.mimeType);
  response.headers.set("Accept-Ranges", "bytes");
  response.headers.set(
    "Content-Disposition",
    `inline; filename="${getFileFullName(file)}"`
  );

  return response;
}
