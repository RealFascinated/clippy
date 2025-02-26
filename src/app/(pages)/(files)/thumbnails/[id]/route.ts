import { notFound } from "@/lib/api-commons";
import { getFileByThumbnailId } from "@/lib/helpers/file";
import { getUserById } from "@/lib/helpers/user";
import { getFileThumbnailPath } from "@/lib/utils/paths";
import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;

  const fileMeta = await getFileByThumbnailId(id);
  if (!fileMeta) {
    return notFound;
  }
  const user = await getUserById(fileMeta.userId);
  const thumbnail = await storage.getFile(
    getFileThumbnailPath(user.id, fileMeta)
  );
  if (!thumbnail) {
    return notFound;
  }

  return new Response(thumbnail, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
