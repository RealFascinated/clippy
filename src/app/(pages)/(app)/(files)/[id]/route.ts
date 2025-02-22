import { getFileById, updateFile } from "@/lib/helpers/file";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<unknown | ApiErrorResponse>> {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const incrementViews = searchParams.get("incrementviews") === "true" || true;

  const file = await getFileById(id);
  let fileBytes = null;
  if (!file || !(fileBytes = await storage.getFile(id))) {
    return notFound;
  }

  if (!isbot(request.headers.get("User-Agent")) && incrementViews) {
    file.views++;
    await updateFile(file.id, {
      views: file.views,
    });
  }

  const response = new NextResponse(fileBytes);
  // Cache for 1 hour on browsers
  response.headers.set("Cache-Control", "max-age=3600, public");
  response.headers.set("Content-Type", file.mimeType);

  return response;
}
