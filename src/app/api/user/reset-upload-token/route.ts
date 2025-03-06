import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { generateUploadToken } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
import { getUserPreferences } from "@/lib/preference";
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
  const user = {
    ...session.user,
    preferences: await getUserPreferences(session.user.id),
  } as UserType;

  try {
    await auth.api.updateUser({
      body: {
        uploadToken: generateUploadToken(),
      },
      headers: requestHeaders,
    });

    Notifications.sendResetUploadTokenNotification(user);
  } catch {
    return NextResponse.json(
      { message: "An error occured when resetting the upload token" },
      { status: 500 }
    );
  }

  Logger.info(`User ${session.user.username} reset their upload token`);
  return NextResponse.json({ message: "Reset Upload Token" }, { status: 200 });
}
