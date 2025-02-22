import { authError } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { getUserFiles } from "@/lib/helpers/user";
import { ApiErrorResponse } from "@/type/api/responses";
import { RecentFilesResponse } from "@/type/api/user/recent-files-response";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<RecentFilesResponse | ApiErrorResponse>> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError();
  }

  const files = await getUserFiles(session.user.id, {
    limit: 10,
    sort: {
      key: "createdAt",
      direction: "desc",
    },
  });

  return NextResponse.json(
    {
      files,
    },
    { status: 200 }
  );
}
