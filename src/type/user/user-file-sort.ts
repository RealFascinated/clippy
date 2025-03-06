import { FileKeys } from "../file/file-keys";
import { SortDirection } from "../sort-direction";

export type UserFilesSort = {
  key: FileKeys;
  direction: SortDirection;
};
