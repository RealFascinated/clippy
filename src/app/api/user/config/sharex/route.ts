import { COMPRESS_PERCENTAGE_DEFAULT } from "@/app/api/upload/route";
import { handleApiRequestWithUser } from "@/lib/api-commons";
import ApiError from "@/lib/api-errors/api-error";
import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    if (!user.uploadToken) {
      throw new ApiError("You do not have an upload token", 400);
    }

    return NextResponse.json(
      {
        Version: "14.1.0",
        Name: `${env.NEXT_PUBLIC_WEBSITE_NAME}`,
        DestinationType: "ImageUploader, TextUploader, FileUploader",
        RequestMethod: "POST",
        RequestURL: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/upload`,
        Body: "MultipartFormData",
        Arguments: {
          "x-clippy-upload-token": `${user.uploadToken}`,
          ...(env.COMPRESS_IMAGES
            ? {
                "x-clippy-compress-percentage": `${COMPRESS_PERCENTAGE_DEFAULT}`,
              }
            : {}),
        },
        FileFormName: "sharex",
        URL: "{json:url}/{json:path}",
        DeletionURL: "{json:deletionUrl}",
        ErrorMessage: "{json:message}",
      },
      {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="sharex-config-${user.name}.sxcu"`,
        },
      }
    );
  });
}
