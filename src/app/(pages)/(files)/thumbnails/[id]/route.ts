import { handleApiRequest, notFound } from "@/lib/api-commons";
import { getThumbnailById } from "@/lib/helpers/thumbnail";
import { getFileThumbnailPath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const { id } = await params;

    const meta = await getThumbnailById(id);
    if (!meta) {
      throw notFound;
    }
    const thumbnail = await storage.getFile(
      getFileThumbnailPath(meta.userId, meta)
    );
    if (!thumbnail) {
      throw notFound;
    }

    return new NextResponse(thumbnail, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=43200", // 12 hours
      },
    });
  });
}
