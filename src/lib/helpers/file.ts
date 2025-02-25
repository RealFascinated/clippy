import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { fileTable } from "../db/schemas/file";

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
