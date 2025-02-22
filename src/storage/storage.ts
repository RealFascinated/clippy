export default abstract class Storage {
  /**
   * Saves a file to the storage.
   *
   * @param name the name of the file to save
   * @param data the buffer for the file
   * @returns true if saved, false if an error occured
   */
  abstract saveFile(name: string, data: Buffer): Promise<boolean>;

  /**
   * Gets a file from the storage.
   *
   * @param name the name of the file to get
   * @returns the file, or null if not found
   */
  abstract getFile(name: string): Promise<Buffer | null>;

  /**
   * Deleted a file from the storage.
   *
   * @param name the name of the file to delete
   * @returns true if deleted, false if an error occured
   */
  abstract deleteFile(name: string): Promise<boolean>;
}
