import internal, { Readable } from "stream";

export default abstract class Storage {
  /**
   * Saves a file to the storage.
   *
   * @param name the name of the file to save
   * @param data the buffer or readable stream for the file
   * @param size the size of the file in bytes (required when data is a stream)
   * @returns true if saved, false if an error occured
   */
  abstract saveFile(
    name: string,
    data: Buffer | Readable,
    size?: number
  ): Promise<boolean>;

  /**
   * Gets a file from the storage.
   *
   * @param name the name of the file to get
   * @returns the file, or null if not found
   */
  abstract getFile(name: string): Promise<Buffer | null>;

  /**
   * Gets a file stream from the storage.
   *
   * @param name the name of the file to get
   * @returns the file, or null if not found
   */
  abstract getFileStream(name: string): Promise<internal.Readable | null>;

  /**
   * Gets a file stream from the storage.
   *
   * @param name the name of the file to get
   * @param start the start of the range
   * @param end the end of the range
   * @returns the file, or null if not found
   */
  abstract getFileStreamRange(
    name: string,
    start: number,
    end: number
  ): Promise<internal.Readable | null>;

  /**
   * Deleted a file from the storage.
   *
   * @param name the name of the file to delete
   * @returns true if deleted, false if an error occured
   */
  abstract deleteFile(name: string): Promise<boolean>;

  /**
   * Renames a file in the storage.
   *
   * @param oldName the old name of the file
   * @param newName the new name of the file
   * @returns true if renamed, false if an error occured
   */
  abstract renameFile(oldName: string, newName: string): Promise<boolean>;
}
