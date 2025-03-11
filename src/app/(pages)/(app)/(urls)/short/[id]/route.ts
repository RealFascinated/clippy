import {
  getShortenedUrlById,
  updateShortenedUrl,
} from "@/lib/helpers/shortened-urls";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;
  const url = await getShortenedUrlById(id);
  if (!url) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  await updateShortenedUrl(url.id, {
    clicks: url.clicks + 1,
  });

  return NextResponse.redirect(url.url);
}
