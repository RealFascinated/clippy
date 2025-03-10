import { handleApiRequestWithUser, notFound } from "@/lib/api-commons";
import { getFileById, updateFile } from "@/lib/helpers/file";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    const { key } = await params;
    const file = await getFileById(key);
    if (!file) {
      Logger.error(`File not found 1: ${key}`);
      return notFound;
    }

    if (file.userId !== user.id) {
      Logger.error(`File not found 2: ${key}`);
      return notFound;
    }

    await updateFile(file.id, {
      favorited: true,
    });

    return NextResponse.json(
      {
        message: "Successfully favorited",
      },
      { status: 200 }
    );
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    const { key } = await params;
    const file = await getFileById(key);
    if (!file) {
      return notFound;
    }

    if (file.userId !== user.id) {
      return notFound;
    }

    await updateFile(file.id, {
      favorited: false,
    });

    return NextResponse.json(
      {
        message: "Successfully unfavorited",
      },
      { status: 200 }
    );
  });
}
