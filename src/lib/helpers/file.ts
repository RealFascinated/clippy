import { storage } from "@/storage/create-storage";
import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { UserType } from "../db/schemas/auth-schema";
import { fileTable, FileType } from "../db/schemas/file";
import { getThumbnail } from "../utils/thumbmail";
import { getFileExtension } from "../utils/file";
import { getFilePath, getFileThumbnailPath } from "../utils/paths";
import { randomString } from "../utils/utils";

/**
 * Gets the file from the database
 *
 * @param id the id of the file
 * @returns the file, or undefined if not found
 */
export async function getFileById(id: string) {
  if (id.includes(".")) {
    id = id.split(".")[0];
  }
  return (await db.select().from(fileTable).where(eq(fileTable.id, id)))[0];
}

/**
 * Gets the file from the database
 * using it's thumbnail id
 *
 * @param id the id of the thumbnail
 * @returns the file, or undefined if not found
 */
export async function getFileByThumbnailId(id: string) {
  if (id.includes(".")) {
    id = id.split(".")[0];
  }
  return (
    await db.select().from(fileTable).where(eq(fileTable.thumbnailId, id))
  )[0];
}

/**
 * Gets the file from the database
 *
 * @param id the delete key of the file
 * @returns the file, or undefined if not found
 */
export async function getFileByDeleteKey(deleteKey: string) {
  return (
    await db.select().from(fileTable).where(eq(fileTable.deleteKey, deleteKey))
  )[0];
}

/**
 * Removed the file from the database
 *
 * @param id the file's id
 */
export async function removeFile(id: string) {
  return await db.delete(fileTable).where(eq(fileTable.id, id));
}

/**
 * Updates a file in the database
 *
 * @param id the file's id
 * @param values the values to update
 */
export async function updateFile(id: string, values: Record<string, unknown>) {
  await db.update(fileTable).set(values).where(eq(fileTable.id, id));
}

/**
 * Uploads a file for a user
 *
 * @param fileId the id of the file
 * @param fileName the raw file name
 * @param fileSize the size of the file
 * @param fileBuffer the buffer of the file
 * @param mimeType the mimetype of the file
 * @param user the user to upload the file to
 */
export async function uploadFile(
  fileId: string,
  fileName: string,
  fileSize: number,
  fileBuffer: Buffer,
  mimeType: string,
  user: UserType,
  createdAt?: Date
): Promise<FileType> {
  const extension = getFileExtension(fileName)?.toLowerCase();
  if (!extension) {
    throw new Error("File is missing an extension, unable to upload");
  }

  const name = `${fileId}.${extension}`;
  const deleteKey = randomString(32);

  const fileMeta: FileType = {
    id: fileId,
    views: 0,
    deleteKey: deleteKey,
    size: fileSize,
    mimeType: mimeType,
    extension: extension,
    originalName: fileName,
    createdAt: createdAt ? createdAt : new Date(),
    userId: user.id,

    // Thumbnail
    thumbnailId: null,
    thumbnailExtension: null,
    thumbnailSize: null,
  };

  if (mimeType.startsWith("image") || mimeType.startsWith("video")) {
    const thumbnailId = randomString(16);
    const thumbnailName = `${thumbnailId}.webp`;
    const thumbnail = await getThumbnail(name, fileBuffer, mimeType);

    fileMeta.thumbnailId = thumbnailId;
    fileMeta.thumbnailExtension = "webp";
    fileMeta.thumbnailSize = thumbnail.size;

    const savedThumbnail = await storage.saveFile(
      getFileThumbnailPath(user.id, fileMeta),
      thumbnail.buffer
    );
    if (!savedThumbnail) {
      await storage.deleteFile(thumbnailName);
      throw new Error("An error occured whilst generating the thumbnail");
    }
  }

  const savedFile = await storage.saveFile(
    getFilePath(user.id, fileMeta),
    fileBuffer
  );
  if (!savedFile) {
    await storage.deleteFile(name);
    throw new Error("An error occured whilst saving your file");
  }

  await db.insert(fileTable).values(fileMeta);

  return fileMeta;
}
