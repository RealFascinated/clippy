import {
  date,
  jsonb,
  pgTable,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export type StorageMetrics = {
  usedStorage: number;
  thumbnailStorage: number;
};

export type FileMetrics = {
  views: number;
  dailyViews: number;
};

export type UserMetrics = {
  uploads: number;
  dailyUploads: number;
};

export const metricsTable = pgTable(
  "metrics",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    storageMetrics: jsonb("storage_metrics").$type<StorageMetrics>(),
    fileMetrics: jsonb("file_metrics").$type<FileMetrics>(),
    userMetrics: jsonb("user_metrics").$type<UserMetrics>(),
  },
  table => ({
    userIdDateIdx: uniqueIndex("user_id_date_idx").on(table.userId, table.date),
  })
);

export type MetricsType = typeof metricsTable.$inferSelect;
export type UserMetricsType = Omit<MetricsType, "userId" | "id">;
