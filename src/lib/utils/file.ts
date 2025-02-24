import { FileType } from "../db/schemas/file";

/**
 * Gets the name of a file, example: example.png
 *
 * @param file the file to get the name for
 * @returns the full name for the file
 */
export function getFileName(file: FileType) {
  return `${file.id}.${file.extension}`;
}
