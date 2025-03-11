import { handleApiRequest, notFound } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import {
  deleteShortenedUrl,
  getShortenedUrlByDeleteKey,
} from "@/lib/helpers/shortened-urls";
import { getUserById } from "@/lib/helpers/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const { key } = await params;
    const url = await getShortenedUrlByDeleteKey(key);
    if (!url) {
      throw notFound;
    }
    const user: UserType | undefined = await getUserById(url.userId);
    if (!user) {
      throw notFound;
    }

    await deleteShortenedUrl(url.id);
    return NextResponse.json(
      {
        message: "Successfully deleted",
      },
      { status: 200 }
    );
  });
}
