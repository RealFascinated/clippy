import { FileType } from "@/lib/db/schemas/file";

export type RecentFilesResponse = {
  files: FileType[];
};
