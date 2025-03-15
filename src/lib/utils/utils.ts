import { clsx, type ClassValue } from "clsx";
import { ReactNode } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { env } from "../env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if we're in production
 */
export function isProduction() {
  return env.NEXT_PUBLIC_APP_ENV === "production";
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
 * Formats file bytes to human readable format.
 *
 * @param bytes the number of bytes to format
 * @param decimalPlaces the number of decimal places to display
 * @returns the formatted size
 */
export function formatBytes(bytes: number, decimalPlaces: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Special case for values less than 1024 bytes
  if (bytes < k) {
    return `${bytes} Bytes`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPlaces)) + " " + sizes[i]
  );
}

/**
 * Copy text to clipboard.
 *
 * @param text the text to copy
 * @param toastText the text to display in the toast
 */
export async function copyWithToast(
  text: string,
  toastText: string | ReactNode
) {
  await copyToClipboard(text);
  toast.success(toastText);
}

/**
 * Copy text to the clipboard.
 *
 * @param text the text to copy
 */
export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param text the text to capitalize
 * @returns the capitalized text
 */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
