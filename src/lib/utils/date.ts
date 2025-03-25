import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize plugins
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

/**
 * Get the date at midnight
 *
 * @param date The date to get the midnight of
 * @returns The date at midnight
 */
export function getMidightAllignedDate(date: Date): Date {
  return dayjs(date).startOf("day").toDate();
}

/**
 * Format a date as a time ago string with precise time format:
 * - Less than 1 hour: "X minutes ago"
 * - Less than 24 hours: "X hour(s), Y minutes ago" (e.g. "1 hour, 30 minutes ago")
 * - Less than 7 days: "X days ago"
 * - Older: Shows full date and time
 *
 * @param date The date to format
 * @returns The formatted date
 */
export function formatTimeAgo(date: Date): string {
  const now = dayjs();
  const then = dayjs(date);

  const diffInMinutes = now.diff(then, "minute");
  const diffInHours = now.diff(then, "hour");
  const diffInDays = now.diff(then, "day");

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diffInHours < 24) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (minutes === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    return `${hours} ${hours === 1 ? "hour" : "hours"}, ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diffInDays < 7) {
    return then.fromNow(); // "X days ago"
  }

  return then.format(DATE_FORMATS.DATE_TIME);
}

/**
 * Format a date using the specified format string
 *
 * @param date The date to format
 * @param formatStr The format string (using Day.js format tokens)
 * @returns The formatted date string
 */
export function formatDate(date: Date, formatStr: string): string {
  return dayjs(date).format(formatStr);
}

/**
 * Get a date string in YYYY-MM-DD format
 *
 * @param date The date to format
 * @returns The date string in YYYY-MM-DD format
 */
export function getDateString(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

// Common format strings used across the application
export const DATE_FORMATS = {
  TIME: "h:mm A",
  DATE_TIME: "DD/MM/YYYY HH:mm A",
  FULL_DATE: "dddd, MMMM D, YYYY",
  SHORT_DATE: "MMM DD",
  ISO_DATE: "YYYY-MM-DD",
} as const;
