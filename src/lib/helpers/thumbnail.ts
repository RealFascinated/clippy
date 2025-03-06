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
