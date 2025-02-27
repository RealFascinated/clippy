import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const fileTable = pgTable("file", {
  id: text("id").primaryKey(),
  deleteKey: text("delete_key").notNull(),
  size: integer("size").notNull(),
  extension: text("extension").notNull(),
  mimeType: text("mime_type").notNull(),
  originalName: text("original_name"),
  createdAt: timestamp("created_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  // Thumbnail
  thumbnailId: text("thumbnail_id").unique(),
  thumbnailExtension: text("thumbnail_extension"),
  thumbnailSize: integer("thumbnail_size"),

  // Metrics
  views: integer("views").notNull(),
});

export type FileType = typeof fileTable.$inferSelect;
