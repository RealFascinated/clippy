import { db } from "@/lib/db/drizzle";
import { fileTable, FileType } from "@/lib/db/schemas/file";
import { thumbnailTable, ThumbnailType } from "@/lib/db/schemas/thumbnail";
import { updateFile } from "@/lib/helpers/file";
import Logger from "@/lib/logger";
import { getFileName } from "@/lib/utils/file";
import { getFilePath, getFileThumbnailPath } from "@/lib/utils/paths";
import { readableToBuffer } from "@/lib/utils/stream";
import { getThumbnail } from "@/lib/utils/thumbmail";
import Queue from "@/queue/queue";
import { storage } from "@/storage/create-storage";
import { and, eq, like, or } from "drizzle-orm";

export default class ThumbnailQueue extends Queue<FileType> {
  constructor() {
    super(1000);
  }

  async loadFiles() {
    this.queue = {
      ...this.queue,
      ...((await db
        .select({
          id: fileTable.id,
          extension: fileTable.extension,
          hasThumbnail: fileTable.hasThumbnail,
          mimeType: fileTable.mimeType,
          userId: fileTable.userId,
        })
        .from(fileTable)
        .where(
          and(
            eq(fileTable.hasThumbnail, false),
            or(
              like(fileTable.mimeType, "image/%"),
              like(fileTable.mimeType, "video/%")
            )
          )
        )) as FileType[]),
    };
  }

  async process(file: FileType) {
    // Skip if file is not an image or video
    if (
      !file.mimeType.startsWith("image/") &&
      !file.mimeType.startsWith("video/")
    ) {
      return;
    }

    const before = performance.now();
    const fileName = getFileName(file);
    Logger.info(`Processing thumbnail for file ${file.id}`);
    try {
      const fileStream = await storage.getFileStream(
        getFilePath(file.userId, file)
      );
      if (fileStream == null) {
        Logger.info(`Failed to get stream for ${fileName}`);
        return;
      }

      const fileBuffer = await readableToBuffer(fileStream);
      const thumbnail = await getThumbnail(fileName, fileBuffer, file.mimeType);
      const thumbnailMeta: ThumbnailType = {
        id: file.id,
        extension: "webp",
        size: thumbnail.size,
        userId: file.userId,
      };

      const savedThumbnail = await storage.saveFile(
        getFileThumbnailPath(file.userId, thumbnailMeta),
        thumbnail.buffer,
        thumbnail.size
      );

      if (!savedThumbnail) {
        await storage.deleteFile(
          getFileThumbnailPath(file.userId, thumbnailMeta)
        );
        Logger.error("An error occurred whilst generating the thumbnail");
        return;
      }

      await db.insert(thumbnailTable).values(thumbnailMeta);
      await updateFile(file.id, {
        hasThumbnail: true,
      });

      Logger.info(`Generated thumbnail for ${fileName}`);
    } catch (err) {
      Logger.error(`Failed to generate thumbnail for ${fileName}`, err);
    }

    Logger.info(
      `Finished processing thumbnail for ${fileName} in ${(
        performance.now() - before
      ).toFixed(2)}ms (${this.queue.length} files remaining)`
    );
  }
}
