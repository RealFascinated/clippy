import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const thumbnailTable = pgTable("thumbnail", {
  id: text("thumbnail_id").primaryKey(),
  extension: text("thumbnail_extension"),
  size: integer("thumbnail_size"),
});

export type ThumbnailType = typeof thumbnailTable.$inferSelect;
