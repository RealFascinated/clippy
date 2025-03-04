import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { getUserFiles, getUserThumbnails } from "@/lib/helpers/user";
import { ApiErrorResponse } from "@/type/api/responses";
import { UserStatisticsResponse } from "@/type/api/user/statistics-response";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<UserStatisticsResponse | ApiErrorResponse>> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError;
  }

  const images = await getUserFiles(session.user.id);
  const thumbnails = await getUserThumbnails(session.user.id);

  const statistics: UserStatisticsResponse = {
    totalUploads: 0,
    uploadsToday: 0,
    storageUsed: 0,
    filesStorageUsed: 0,
    thumbnailStorageUsed: 0,
    totalViews: 0,
  };

  for (const thumbnail of thumbnails) {
    statistics.thumbnailStorageUsed += thumbnail.size;
    statistics.storageUsed += thumbnail.size;
  }

  const currentDate = new Date();
  for (const image of images) {
    statistics.totalUploads++;

    // Check if the upload date is today
    const uploadDate = new Date(image.createdAt);
    if (
      uploadDate.getDate() === currentDate.getDate() &&
      uploadDate.getMonth() === currentDate.getMonth() &&
      uploadDate.getFullYear() === currentDate.getFullYear()
    ) {
      statistics.uploadsToday++;
    }

    statistics.storageUsed += image.size;
    statistics.filesStorageUsed += image.size;
    statistics.totalViews += image.views;
  }

  return NextResponse.json(statistics, { status: 200 });
}
