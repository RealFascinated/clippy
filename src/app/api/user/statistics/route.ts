import { handleApiRequestWithUser } from "@/lib/api-commons";
import { getUserFiles, getUserThumbnails } from "@/lib/helpers/user";
import { UserStatisticsResponse } from "@/type/api/user/statistics-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async (user) => {
    const images = await getUserFiles(user.id);
    const thumbnails = await getUserThumbnails(user.id);

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
  });
}
