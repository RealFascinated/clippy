import { db } from "@/lib/db/drizzle";
import { fileTable, FileType } from "@/lib/db/schemas/file";
import { thumbnailTable, ThumbnailType } from "@/lib/db/schemas/thumbnail";
import { updateFile } from "@/lib/helpers/file";
import { getFileName } from "@/lib/utils/file";
import { getFilePath, getFileThumbnailPath } from "@/lib/utils/paths";
import { getThumbnail } from "@/lib/utils/thumbmail";
import { storage } from "@/storage/create-storage";
import { eq } from "drizzle-orm";
import Task from "../task";

export default class GenerateThumbnailsTask extends Task {
  constructor() {
    super("Generate Thumbnails", "0 * * * * *");
  }

  async run(): Promise<void> {
    // todo: only get images and videos
    const files = await db
      .select({
        id: fileTable.id,
        extension: fileTable.extension,
        hasThumbnail: fileTable.hasThumbnail,
        mimeType: fileTable.mimeType,
        userId: fileTable.userId,
      })
      .from(fileTable)
      .where(eq(fileTable.hasThumbnail, false));

    if (files.length <= 0) {
      this.log(`No files to generate thumbnails for`);
      return;
    }

    this.log(`Starting thumbnail generation for ${files.length} files...`);
    for (const fileMeta of files) {
      if (
        !fileMeta.mimeType.startsWith("image/") &&
        !fileMeta.mimeType.startsWith("video/")
      ) {
        this.log(fileMeta.mimeType);
        continue;
      }

      const fileName = getFileName(fileMeta as FileType);

      const fileBuffer = await storage.getFile(
        getFilePath(fileMeta.userId, fileMeta as FileType)
      );
      if (fileBuffer == null) {
        this.log(`Failed to get buffer for ${fileName}`);
        continue;
      }

      const thumbnail = await getThumbnail(
        fileName,
        fileBuffer,
        fileMeta.mimeType
      );
      const thumbnailMeta: ThumbnailType = {
        id: fileMeta.id,
        extension: "webp",
        size: thumbnail.size,
        userId: fileMeta.userId,
      };

      const savedThumbnail = await storage.saveFile(
        getFileThumbnailPath(fileMeta.userId, thumbnailMeta),
        thumbnail.buffer
      );

      if (!savedThumbnail) {
        await storage.deleteFile(
          getFileThumbnailPath(fileMeta.userId, thumbnailMeta)
        );
        this.log("An error occurred whilst generating the thumbnail");
        continue;
      }

      await db.insert(thumbnailTable).values(thumbnailMeta);
      await updateFile(fileMeta.id, {
        hasThumbnail: true,
      });

      this.log(`Generated thumbnail for ${fileName}`);
    }

    this.log(`Finished generating thumbnails for ${files.length} files`);
  }
}
