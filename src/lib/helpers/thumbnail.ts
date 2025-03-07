import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { thumbnailTable } from "../db/schemas/thumbnail";

/**
 * Gets the thumbnail from the database
 *
 * @param id the id of the thumbnail
 * @returns the thumbnail, or undefined if not found
 */
export async function getThumbnailById(id: string) {
  if (id.includes(".")) {
    id = id.split(".")[0];
  }
  return (
    await db.select().from(thumbnailTable).where(eq(thumbnailTable.id, id))
  )[0];
}

/**
 * Updates a thumbnail in the database
 *
 * @param id the thumbnail's id
 * @param values the values to update
 */
export async function updateThumbnail(
  id: string,
  values: Record<string, unknown>
) {
  await db.update(thumbnailTable).set(values).where(eq(thumbnailTable.id, id));
}
