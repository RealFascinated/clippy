import { env } from "../env";

/**
 * Gets the link for a shortened URL.
 *
 * @param id The ID of the shortened URL.
 * @returns The link for the shortened URL.
 */
export function getShortenedUrlLink(id: string) {
  return `${env.NEXT_PUBLIC_WEBSITE_URL}/s/${id}`;
}
