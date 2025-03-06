import { fileTable } from "@/lib/db/schemas/file";

export type FileKeys = keyof typeof fileTable.$inferSelect;
