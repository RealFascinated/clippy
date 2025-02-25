import { getFileByDeleteKey, removeFile } from "@/lib/helpers/file";
import { getFileName } from "@/lib/utils/file";
import { storage } from "@/storage/create-storage";
import { ApiErrorResponse, ApiSuccessResponse } from "@/type/api/responses";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  const { key } = await params;
  const file = await getFileByDeleteKey(key);
  if (!file) {
    return NextResponse.json({ message: "Unknown Key" }, { status: 404 });
  }

  try {
    const deleted = await storage.deleteFile(getFileName(file));
    if (!deleted) {
      return NextResponse.json(
        { message: "Unable to delete this file, please contact an admin" },
        { status: 500 }
      );
    }
    await removeFile(file.id);
  } catch {
    return NextResponse.json(
      {
        message:
          "An error occured when removing this file, please contact an admin",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Successfully deleted",
    },
    { status: 200 }
  );
}
