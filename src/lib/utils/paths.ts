import { FileType } from "../db/schemas/file";

/**
 * Gets the path for the file in storage
 *
 * @param user the user to get the file path for
 * @param file the file to get the path for
 * @returns the path to the file in storage
 */
export function getFilePath(userId: string, file: FileType) {
  return `${userId}/${file.id}.${file.extension}`;
}

/**
 * Gets the path for the file thumbnail in storage
 *
 * @param user the user to get the file thumbnail path for
 * @param file the file to get the thumbnail path for
 * @returns the path to the thumbnail file in storage
 */
export function getFileThumbnailPath(userId: string, file: FileType) {
  return `${userId}/thumbnails/${file.thumbnailId}.${file.thumbnailExtension}`;
}
