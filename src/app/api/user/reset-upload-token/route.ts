import { authError } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { randomString } from "@/lib/utils/utils";
import { ApiErrorResponse, ApiSuccessResponse } from "@/type/api/responses";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError();
  }

  try {
    await auth.api.updateUser({
      body: {
        uploadToken: randomString(32),
      },
      headers: requestHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: "An error occured when resetting the upload token" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Reset Upload Token" }, { status: 200 });
}
