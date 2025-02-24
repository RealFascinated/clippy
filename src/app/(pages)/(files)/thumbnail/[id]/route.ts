import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

const notFound = NextResponse.json({ message: "File not found" }, { status: 404 });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;

  const thumbnail = await storage.getFile(id);
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
