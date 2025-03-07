import { handleApiRequestWithUser } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { generateUploadToken } from "@/lib/helpers/user";
import Logger from "@/lib/logger";
import { Notifications } from "@/lib/notification";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    const requestHeaders = await headers();
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

    Logger.info(`User ${user.username} reset their upload token`);
    return NextResponse.json(
      { message: "Reset Upload Token" },
      { status: 200 }
    );
  });
}
