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

/**
 * Gets the extension for a file name
 * 
 * @param fileName the name of the file
 * @returns the file extension
 */
export function getFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : undefined;
}