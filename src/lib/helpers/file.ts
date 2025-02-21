import { eq } from "drizzle-orm";
import { fileTable } from "../db/schemas/file";
import { db } from "../db/drizzle";

/**
 * Gets the file from the database
 *
 * @param id the id of the file
 * @returns the file, or undefined if not found
 */
export async function getFileById(id: string) {
  return (await db.select().from(fileTable).where(eq(fileTable.id, id)))[0];
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
