import { env } from "@/lib/env";
import { readableToBuffer } from "@/lib/utils";
import * as Minio from "minio";
import Storage from "../storage";

export default class S3Storage extends Storage {
  private client: Minio.Client;

  constructor() {
    super();
    this.client = new Minio.Client({
      endPoint: env.STORAGE_S3_ENDPOINT,
      port: env.STORAGE_S3_PORT,
      useSSL: env.STORAGE_S3_USE_SSL,
      accessKey: env.STORAGE_S3_ACCESS_KEY,
      secretKey: env.STORAGE_S3_SECRET_KEY,
    });
  }

  async saveFile(name: string, data: Buffer): Promise<boolean> {
    try {
      await this.client.putObject(env.STORAGE_S3_BUCKET, name, data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getFile(name: string): Promise<Buffer | null> {
    try {
      const file = await this.client.getObject(env.STORAGE_S3_BUCKET, name);
      return readableToBuffer(file);
    } catch {
      return null;
    }
  }

  async deleteFile(name: string): Promise<boolean> {
    try {
      await this.client.removeObject(env.STORAGE_S3_BUCKET, name);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
