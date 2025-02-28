import fs from "fs/promises";
import os from "os";
import path from "path";
import Sharp from "sharp";
import Logger from "../logger";
import { extractVideoThumbnail } from "./ffmpeg";
import { getFileExtension } from "./file";
import { randomString } from "./utils";

/**
 * Gets a thumbnail for an image or video.
 *
 * @param fileName the name of the file
 * @param buffer the buffer for the file
 * @param mimeType the mimetype of the file
 * @param quality the quality of the WebP output (default is 80)
 * @returns an object containing the thumbnail buffer and its size
 */
export async function getThumbnail(
  fileName: string,
  buffer: Buffer,
  mimeType: string,
  quality = 80 // Default quality set to 80
): Promise<{ buffer: Buffer; size: number }> {
  let thumbnail: Buffer | undefined;

  if (mimeType.includes("video")) {
    const tempDir = path.join(os.tmpdir(), `clippy-${randomString(8)}`);
    await fs.mkdir(tempDir);

    const inputPath = path.join(
      tempDir,
      `${randomString(8)}.${getFileExtension(fileName)}`
    );
    const outputPath = path.join(tempDir, `${randomString(8)}.webp`);

    try {
      await fs.writeFile(inputPath, buffer);
      await extractVideoThumbnail(inputPath, outputPath);

      // Read the generated WebP thumbnail
      thumbnail = await fs.readFile(outputPath);

      // Resize the thumbnail to a maximum width and height of 250 pixels using Sharp
      thumbnail = await Sharp(thumbnail)
        .resize(250, 250, { fit: "inside" })
        .webp({ quality })
        .toBuffer();
    } catch (err) {
      Logger.warn(
        `An error occurred while processing the video file ${fileName}:`,
        err
      );
    } finally {
      // Cleanup temporary files
      await fs.rmdir(tempDir);
      Logger.warn(`Cleaning up thumbnail directory: ${tempDir}`);
    }
  } else if (mimeType.includes("image")) {
    try {
      thumbnail = await Sharp(buffer)
        .resize(250, 250, { fit: "inside" })
        .webp({ quality })
        .toBuffer();
    } catch (err) {
      Logger.warn(
        `An error occurred while processing the image file ${fileName}:`,
        err
      );
    }
  }

  if (!thumbnail) {
    throw new Error(`Failed to generate a thumbnail for ${fileName}`);
  }

  return { buffer: thumbnail, size: thumbnail.length };
}
