import { handleApiRequestWithUser } from "@/lib/api-commons";
import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    if (!user.uploadToken) {
      return NextResponse.json(
        {
          message: "You do not have an upload token",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      JSON.stringify({
        Version: "14.1.0",
        Name: `${env.NEXT_PUBLIC_WEBSITE_NAME}`,
        DestinationType: "ImageUploader, TextUploader, FileUploader",
        RequestMethod: "POST",
        RequestURL: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/upload/sharex`,
        Body: "MultipartFormData",
        Arguments: {
          token: `${user.uploadToken}`,
        },
        FileFormName: "sharex",
        URL: "{json:url}/{json:path}",
        DeletionURL: "{json:deletionUrl}",
        ErrorMessage: "{json:message}",
      }),
      {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="sharex-config-${user.name}.sxcu"`,
        },
      }
    );
  });
}
