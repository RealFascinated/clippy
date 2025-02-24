import { users } from "@/lib/db/schemas/auth-schema";
import { AnyColumn, asc, count, desc, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { fileTable } from "../db/schemas/file";
import { randomString } from "../utils/utils";

/**
 * Gets a user by their upload token
 *
 * @param token the users upload token
 * @returns the user, or undefined if not found
 */
export async function getUserByUploadToken(token: string) {
  return (await db.select().from(users).where(eq(users.uploadToken, token)))[0];
}

/**
 * Gets all of the users files.
 *
 * @param id the id of the user
 * @param options the options to fetch the files with
 * @returns the files for the user.
 */
export async function getUserFiles(
  id: string,
  options?: {
    sort?: {
      key: keyof typeof fileTable.$inferSelect;
      direction: "asc" | "desc";
    };
    limit?: number;
    offset?: number;
  }
) {
  const query = db.select().from(fileTable).where(eq(fileTable.userId, id));

  if (options?.limit) {
    query.limit(options.limit);
  }

  if (options?.offset) {
    query.offset(options.offset);
  }

  if (options?.sort) {
    const { key, direction } = options.sort;

    // Ensure the key is a valid column from fileTable
    const column = fileTable[key as keyof typeof fileTable] as AnyColumn;
    if (!column) {
      throw new Error(`Column "${key}" on ${fileTable._.name} was not found.`);
    }

    // Apply sorting based on the direction
    query.orderBy(direction === "asc" ? asc(column) : desc(column));
  }

  return await query;
}

/**
 * Gets the total amount of files
 * this user has uploaded
 *
 * @param id the id of the user
 * @returns the amount of files uploaded
 */
export async function getUserFilesCount(id: string) {
  const query = await db.select({ count: count() }).from(fileTable).where(eq(fileTable.userId, id));
  return query[0].count ?? undefined;
}

/**
 * Generates a new upload token for a user
 *
 * @returns the upload token
 */
export function generateUploadToken() {
  return randomString(32);
}
