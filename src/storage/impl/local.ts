import { env } from "@/lib/env";
import { createReadStream } from "fs";
import fs from "fs/promises";
import path from "path";
import internal, { Readable } from "stream";
import Storage from "../storage";

export default class LocalStorage extends Storage {
  private path: string;

  constructor() {
    super();
    this.path = env.STORAGE_LOCAL_PATH!;
  }

  /**
   * Gets the path to the file.
   *
   * @param name the name of the file
   * @returns the path to the file
   */
  getPath(name: string): string {
    const segments = name.split(/[\/\\]/).filter(Boolean);
    const normalizedPath = segments.join(path.sep);
    return path.join(process.cwd(), this.path, normalizedPath);
  }

  async saveFile(
    name: string,
    data: Buffer | Readable,
    size?: number
  ): Promise<boolean> {
    try {
      const filePath = this.getPath(name);
      const dirPath = path.dirname(filePath);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, data);
      return true;
    } catch {
      return false;
    }
  }

  async getFile(name: string): Promise<Buffer | null> {
    try {
      const filePath = this.getPath(name);
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  async getFileStream(name: string): Promise<internal.Readable | null> {
    try {
      const filePath = this.getPath(name);
      return createReadStream(filePath);
    } catch {
      return null;
    }
  }

  async deleteFile(name: string): Promise<boolean> {
    try {
      const filePath = this.getPath(name);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileStreamRange(
    name: string,
    start: number,
    end: number
  ): Promise<internal.Readable | null> {
    try {
      const filePath = this.getPath(name);
      return createReadStream(filePath, { start, end });
    } catch {
      return null;
    }
  }

  async renameFile(oldName: string, newName: string): Promise<boolean> {
    try {
      const oldFilePath = this.getPath(oldName);
      const newFilePath = this.getPath(newName);
      const newDirPath = path.dirname(newFilePath);
      await fs.mkdir(newDirPath, { recursive: true });
      await fs.rename(oldFilePath, newFilePath);
      return true;
    } catch {
      return false;
    }
  }
}
