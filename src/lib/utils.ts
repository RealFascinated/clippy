import { clsx, type ClassValue } from "clsx"
import internal from "stream";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the full buffer from the stream.
 *
 * @param readable the readable stream
 * @returns a buffer from the stream
 */
export async function readableToBuffer(
  readable: internal.Readable
): Promise<Buffer> {
  if (!readable || typeof readable.on !== "function") {
    throw new TypeError("Input must be a Readable stream");
  }

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    readable.on("data", (chunk: Buffer) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

/**
 * Generates a secure random string of specified length
 * using a combination of uppercase, lowercase letters and numbers.
 *
 * @param length the desired length of the random string
 * @returns a random string of the specified length
 * @throws error if length is less than 1
 */
export function randomString(length: number): string {
  // Validate the input length
  if (length < 1) {
    throw new Error("Length must be at least 1");
  }

  // Define the character set for the random string
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Create a Uint8Array to store random values
  const randomBytes = new Uint8Array(length);

  // Fill the array with cryptographically secure random values
  crypto.getRandomValues(randomBytes);

  // Convert random bytes to characters from our charset
  let result = "";
  for (let i = 0; i < length; i++) {
    // Use modulo to map the random byte to our charset length
    result += charset[randomBytes[i] % charset.length];
  }

  return result;
}

/**
 * Gets the file extension from the mime.
 *
 * @param mime the mime to use
 * @returns the file extension
 */
export function getFileExtension(mime: string) {
  return mime.split("/")[1];
}