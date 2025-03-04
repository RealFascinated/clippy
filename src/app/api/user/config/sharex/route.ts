import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { ApiErrorResponse, ApiSuccessResponse } from "@/type/api/responses";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError;
  }

  if (!session.user.uploadToken) {
    return NextResponse.json(
      {
        message: "You do not have an upload token",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    JSON.parse(`{
    "Version": "14.1.0",
    "Name": "${env.NEXT_PUBLIC_WEBSITE_NAME}",
    "DestinationType": "ImageUploader, TextUploader, FileUploader",
    "RequestMethod": "POST",
    "RequestURL": "${env.NEXT_PUBLIC_WEBSITE_URL}/api/upload/sharex",
    "Body": "MultipartFormData",
    "Arguments": {
        "token": "${session.user.uploadToken}"
    },
    "FileFormName": "sharex",
    "URL": "{json:url}/{json:path}",
    "DeletionURL": "{json:deletionUrl}",
    "ErrorMessage": "{json:message}"
    }`),
    {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="sharex-config-${session.user.name}.sxcu"`,
      },
    }
  );
}
