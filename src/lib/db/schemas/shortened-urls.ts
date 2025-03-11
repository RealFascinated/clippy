import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const shortenedUrlsTable = pgTable("shortened_urls", {
  id: text("id").primaryKey(),
  deleteKey: text("delete_key").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  // Metrics
  clicks: integer("clicks").notNull(),
});

export type ShortenedUrlType = typeof shortenedUrlsTable.$inferSelect;
