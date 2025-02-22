import { FileType } from "../db/schemas/file";
import { getFileExtension } from "../utils";

/**
 * Gets the full name of a file, example: example.png
 *
 * @param file the file to get the name for
 * @returns the full name for the file
 */
export function getFileFullName(file: FileType) {
  return `${file.id}.${getFileExtension(file.mimeType)}`;
}
