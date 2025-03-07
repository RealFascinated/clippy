import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { updateUserPreferences } from "@/lib/preference";
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
    return authError;
  }
  const { showKitty, webhookUrl, notifications } = await request.json();
  await updateUserPreferences(session.user.id, {
    showKitty,
    webhookUrl,
    notifications,
  });
  return NextResponse.json({ message: "Preference Update" }, { status: 200 });
}
