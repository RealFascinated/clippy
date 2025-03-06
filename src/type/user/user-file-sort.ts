import { fileTable } from "@/lib/db/schemas/file";

export type UserFilesSort = {
  key: keyof typeof fileTable.$inferSelect;
  direction: "asc" | "desc";
};
