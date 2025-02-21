import { storage } from "@/storage/create-storage";
import { ApiErrorResponse } from "@/type/api/responses";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<unknown | ApiErrorResponse>> {
  const { id } = await params;
  const file = await storage.getFile(id);
  if (!file) {
    return NextResponse.json(
      {
        message: "File not found",
      },
      {
        status: 404,
      }
    );
  }

  return new NextResponse(file);
}
