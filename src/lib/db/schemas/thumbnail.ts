import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const thumbnailTable = pgTable("thumbnail", {
  id: text("thumbnail_id").primaryKey(),
  extension: text("thumbnail_extension").notNull(),
  size: integer("thumbnail_size").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export type ThumbnailType = typeof thumbnailTable.$inferSelect;
