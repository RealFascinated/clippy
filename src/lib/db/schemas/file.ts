import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const fileTable = pgTable("file", {
  id: text("id").primaryKey(),
  deleteKey: text("delete_key").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").notNull(),
  storageName: text("storage_name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  // Metrics
  views: integer("views").notNull(),
});
