import { and, AnyColumn, asc, count, desc, eq, like } from "drizzle-orm";
import { db } from "../db/drizzle";
import {
  shortenedUrlsTable,
  ShortenedUrlType,
} from "../db/schemas/shortened-urls";
import { env } from "../env";
import { randomString } from "../utils/utils";

export type ShortenedUrlOptions = {
  limit?: number;
  offset?: number;
  sort?: {
    key: string;
    direction: "asc" | "desc";
  };
  search?: string;
};

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

/**
 * Gets a list of shortened URLs.
 *
 * @param options The options for the shortened URLs.
 * @returns The shortened URLs.
 */
export async function getShortenedUrls(options: ShortenedUrlOptions) {
  const { limit, offset, sort, search } = options;

  const query = db.select().from(shortenedUrlsTable);

  if (search) {
    query.where(like(shortenedUrlsTable.url, `%${search}%`));
  }

  if (sort) {
    const { key, direction } = sort;

    // Ensure the key is a valid column from fileTable
    const column = shortenedUrlsTable[
      key as keyof typeof shortenedUrlsTable
    ] as AnyColumn;
    if (!column) {
      throw new Error(
        `Column "${key}" on ${shortenedUrlsTable._.name} was not found.`
      );
    }

    // Apply sorting based on the direction
    query.orderBy(direction === "asc" ? asc(column) : desc(column));
  }

  if (limit) {
    query.limit(limit);
  }

  if (offset) {
    query.offset(offset);
  }

  return await query;
}

/**
 * Gets the total number of shortened URLs.
 *
 * @returns The total number of shortened URLs.
 */
export async function getShortenedUrlsCount(options: ShortenedUrlOptions) {
  const query = await db
    .select({ count: count() })
    .from(shortenedUrlsTable)
    .where(
      and(
        options?.search
          ? like(shortenedUrlsTable.url, `%${options.search}%`)
          : undefined
      )
    );
  return query[0].count ?? undefined;
}
