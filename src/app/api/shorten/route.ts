import { handleApiRequest } from "@/lib/api-commons";
import ApiError from "@/lib/api-errors/api-error";
import { env } from "@/lib/env";
import { createShortenedUrl } from "@/lib/helpers/shortened-urls";
import { getUserByUploadToken } from "@/lib/helpers/user";
import { NextResponse } from "next/server";

interface SuccessResponse {
  /**
   * The path to the uploaded file.
   */
  path: string;

  /**
   * The url of this Clippy instance.
   */
  url: string;

  /**
   * The url to delete the file.
   */
  deletionUrl: string;
}

function getOptions(formData: FormData): {
  uploadToken: string;
} {
  const uploadToken: string | undefined = formData
    .get("x-clippy-upload-token")
    ?.toString();
  if (!uploadToken) {
    throw new ApiError("No upload token was provided", 400);
  }

  return { uploadToken };
}

/**
 * Handles file uploads from ShareX
 * @param request The incoming request containing form data
 */
export async function POST(request: Request): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const formData = await request.formData();
    const { uploadToken } = getOptions(formData);

    const user = await getUserByUploadToken(uploadToken);
    if (!user) {
      throw new ApiError("Invalid upload token", 401);
    }

    const url = formData.get("url")?.toString();
    if (!url) {
      throw new ApiError("No URL was provided", 400);
    }

    const shortenedUrl = await createShortenedUrl(url, user.id);

    return NextResponse.json({
      url: `${env.NEXT_PUBLIC_WEBSITE_URL}/short/${shortenedUrl.id}`,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/shorten/delete/${shortenedUrl.deleteKey}`,
    } as SuccessResponse);
  });
}

// Configuration for the API route
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    maxDuration: 60,
  },
};
