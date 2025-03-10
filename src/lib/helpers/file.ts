import { storage } from "@/storage/create-storage";
import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { UserType } from "../db/schemas/auth-schema";
import { fileTable, FileType } from "../db/schemas/file";
import Logger from "../logger";
import { getFileExtension, getFileName } from "../utils/file";
import { getFilePath } from "../utils/paths";
import { formatBytes, randomString } from "../utils/utils";

/**
 * Gets the file from the database
 *
 * @param id the id of the file
 * @returns the file, or undefined if not found
 */
export async function getFileById(id: string): Promise<FileType | undefined> {
  if (id.includes(".")) {
    id = id.split(".")[0];
  }
  return (await db.select().from(fileTable).where(eq(fileTable.id, id)))[0];
}

/**
 * Gets the file from the database
 *
 * @param id the delete key of the file
 * @returns the file, or undefined if not found
 */
export async function getFileByDeleteKey(
  deleteKey: string
): Promise<FileType | undefined> {
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
  mimeType = mimeType.toLowerCase();
  const before = Date.now();
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
    hasThumbnail: false,
    favorited: false,
  };

  const result = await storage.saveFile(
    getFilePath(user.id, fileMeta),
    fileBuffer
  );

  if (!result) {
    await storage.deleteFile(name);
    throw new Error("An error occurred whilst saving your file");
  }

  // Insert into database
  await db.insert(fileTable).values(fileMeta);

  Logger.info(
    `A new file has been uploaded "${getFileName(fileMeta)}" (${mimeType}, ${formatBytes(fileMeta.size)}, took: ${Date.now() - before}ms)`
  );

  return fileMeta;
}
