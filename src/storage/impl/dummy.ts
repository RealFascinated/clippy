import internal from "stream";
import Storage from "../storage";

export default class DummyStorage extends Storage {
  constructor() {
    super();
  }

  async saveFile(name: string, data: Buffer): Promise<boolean> {
    return false;
  }

  async getFile(name: string): Promise<Buffer | null> {
    return null;
  }

  async getFileStream(name: string): Promise<internal.Readable | null> {
    return null;
  }

  async deleteFile(name: string): Promise<boolean> {
    return false;
  }

  async getFileStreamRange(
    name: string,
    start: number,
    end: number
  ): Promise<internal.Readable | null> {
    return null;
  }

  async renameFile(oldName: string, newName: string): Promise<boolean> {
    return false;
  }
}
