import fs from "fs/promises";
import os from "os";
import path from "path";
import Sharp from "sharp";
import { Readable } from "stream";
import Logger from "../logger";
import { extractVideoThumbnail } from "./ffmpeg";
import { getFileExtension } from "./file";
import { randomString } from "./utils";

/**
 * Gets a thumbnail for an image or video.
 *
 * @param fileName the name of the file
 * @param input the input stream or buffer for the file
 * @param mimeType the mimetype of the file
 * @param quality the quality of the WebP output (default is 80)
 * @returns an object containing the thumbnail buffer and its size
 */
export async function getThumbnail(
  fileName: string,
  input: Readable | Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; size: number }> {
  let thumbnail: Buffer | undefined;

  if (mimeType.includes("video")) {
    const tempDir = path.join(os.tmpdir(), `clippy-${randomString(8)}`);
    await fs.mkdir(tempDir);

    const inputPath = path.join(
      tempDir,
      `${randomString(8)}.${getFileExtension(fileName)}`
    );
    const outputPath = path.join(tempDir, `${randomString(8)}.jpg`);

    try {
      // If input is a stream, write it to a file first
      if (Buffer.isBuffer(input)) {
        await fs.writeFile(inputPath, input);
      } else {
        const writeStream = await fs.open(inputPath, "w");
        await new Promise<void>((resolve, reject) => {
          input
            .pipe(writeStream.createWriteStream())
            .on("finish", () => resolve())
            .on("error", reject);
        });
      }

      await extractVideoThumbnail(inputPath, outputPath);

      // Read the generated WebP thumbnail
      thumbnail = await fs.readFile(outputPath);

      // Resize the thumbnail to a maximum width and height of 250 pixels using Sharp
      thumbnail = await Sharp(thumbnail)
        .resize(250, 250, { fit: "inside" })
        .webp({ quality: 90 })
        .toBuffer();
    } catch (err) {
      Logger.warn(
        `An error occurred while processing the video file ${fileName}:`,
        err
      );
      throw err;
    } finally {
      // Cleanup temporary files
      await fs.rm(tempDir, {
        recursive: true,
        force: true,
      });
      Logger.warn(`Cleaning up thumbnail directory: ${tempDir}`);
    }
  } else {
    try {
      // For images, we can pipe directly through Sharp
      const sharpInstance = Sharp();
      if (Buffer.isBuffer(input)) {
        thumbnail = await Sharp(input)
          .resize(250, 250, { fit: "inside" })
          .webp({ quality: 90 })
          .toBuffer();
      } else {
        thumbnail = await new Promise((resolve, reject) => {
          input
            .pipe(
              sharpInstance
                .resize(250, 250, { fit: "inside" })
                .webp({ quality: 90 })
            )
            .toBuffer()
            .then(resolve)
            .catch(reject);
        });
      }
    } catch (err) {
      Logger.warn(
        `An error occurred while processing the image file ${fileName}:`,
        err
      );
      throw err;
    }
  }

  if (!thumbnail) {
    throw new Error(`Failed to generate a thumbnail for ${fileName}`);
  }

  return { buffer: thumbnail, size: thumbnail.length };
}
