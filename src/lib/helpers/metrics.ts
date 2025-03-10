import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { fileTable } from "../db/schemas/file";
import {
  FileMetrics,
  StorageMetrics,
  UserMetrics,
} from "../db/schemas/metrics";
import { thumbnailTable } from "../db/schemas/thumbnail";

/**
 * Get the metrics for a user
 *
 * @param id The id of the user
 * @returns The metrics for the user
 */
export async function getUserMetrics(id: string): Promise<{
  storageMetrics: StorageMetrics;
  fileMetrics: FileMetrics;
  userMetrics: UserMetrics;
}> {
  const storageMetrics: StorageMetrics = {
    usedStorage: 0,
    thumbnailStorage: 0,
  };

  const fileMetrics: FileMetrics = {
    views: 0,
    dailyViews: 0,
  };

  const userMetrics: UserMetrics = {
    uploads: 0,
    dailyUploads: 0,
  };

  const [files, thumbnails] = await Promise.all([
    db.select().from(fileTable).where(eq(fileTable.userId, id)),
    db.select().from(thumbnailTable).where(eq(thumbnailTable.userId, id)),
  ]);

  for (const file of files) {
    storageMetrics.usedStorage += file.size;
    fileMetrics.views += file.views;

    userMetrics.uploads++;

    const currentDate = new Date();
    const uploadDate = new Date(file.createdAt);
    if (
      uploadDate.getDate() === currentDate.getDate() &&
      uploadDate.getMonth() === currentDate.getMonth() &&
      uploadDate.getFullYear() === currentDate.getFullYear()
    ) {
      userMetrics.dailyUploads++;
      fileMetrics.dailyViews += file.views;
    }
  }

  for (const thumbnail of thumbnails) {
    storageMetrics.thumbnailStorage += thumbnail.size;
    storageMetrics.usedStorage += thumbnail.size;
  }

  return {
    storageMetrics,
    fileMetrics,
    userMetrics,
  };
}
