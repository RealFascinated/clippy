import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

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
 * Format a date as a time ago string (e.g. 1 day ago, or 12/12/2024 12:00 PM)
 *
 * @param date The date to format
 * @returns The formatted date
 */
export function formatTimeAgo(date: Date): string {
  const now = dayjs();
  const then = dayjs(date);
  const diffInHours = now.diff(then, "hour");

  if (diffInHours >= 24) {
    return then.format("DD/MM/YYYY HH:mm A");
  }

  return then.fromNow();
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
  FULL_DATE: "EEEE, MMMM D, YYYY",
  SHORT_DATE: "MMM DD",
  ISO_DATE: "YYYY-MM-DD",
} as const;
