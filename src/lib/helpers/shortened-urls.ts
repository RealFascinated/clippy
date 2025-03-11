import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import {
  shortenedUrlsTable,
  ShortenedUrlType,
} from "../db/schemas/shortened-urls";
import { env } from "../env";
import { randomString } from "../utils/utils";

/**
 * Creates a shortened URL.
 *
 * @param url The URL to shorten.
 * @param userId The user ID.
 * @returns The shortened URL.
 */
export async function createShortenedUrl(
  url: string,
  userId: string
): Promise<ShortenedUrlType> {
  const id = randomString(env.SHORT_URL_LENGTH);

  const urlMeta: ShortenedUrlType = {
    id,
    deleteKey: randomString(env.SHORT_URL_LENGTH),
    url,
    userId,
    clicks: 0,
    createdAt: new Date(),
  };

  await db.insert(shortenedUrlsTable).values(urlMeta);
  return urlMeta;
}

/**
 * Gets a shortened URL by ID.
 *
 * @param id The ID of the shortened URL.
 * @returns The shortened URL.
 */
export async function getShortenedUrlById(
  id: string
): Promise<ShortenedUrlType | null> {
  const url = await db
    .select()
    .from(shortenedUrlsTable)
    .where(eq(shortenedUrlsTable.id, id));
  return url[0] ?? null;
}

/**
 * Gets a shortened URL by delete key.
 *
 * @param deleteKey The delete key of the shortened URL.
 * @returns The shortened URL.
 */
export async function getShortenedUrlByDeleteKey(
  deleteKey: string
): Promise<ShortenedUrlType | null> {
  const url = await db
    .select()
    .from(shortenedUrlsTable)
    .where(eq(shortenedUrlsTable.deleteKey, deleteKey));
  return url[0] ?? null;
}

/**
 * Deletes a shortened URL.
 *
 * @param id The ID of the shortened URL.
 */
export async function deleteShortenedUrl(id: string) {
  await db.delete(shortenedUrlsTable).where(eq(shortenedUrlsTable.id, id));
}

/**
 * Updates a shortened URL.
 *
 * @param id The ID of the shortened URL.
 * @param values The values to update.
 */
export async function updateShortenedUrl(
  id: string,
  values: Partial<ShortenedUrlType>
) {
  await db
    .update(shortenedUrlsTable)
    .set(values)
    .where(eq(shortenedUrlsTable.id, id));
}
