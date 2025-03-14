import { format, formatDistance } from "date-fns";

/**
 * Get the date at midnight
 *
 * @param date The date to get the midnight of
 * @returns The date at midnight
 */
export function getMidightAllignedDate(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Format a date as a time ago string (e.g. 1 day ago, or 12/12/2024 12:00 PM)
 *
 * @param date The date to format
 * @returns The formatted date
 */
export function formatTimeAgo(date: Date): string {
  const currentDate = new Date();
  const oldDate = new Date(date);
  const difference = currentDate.getTime() - oldDate.getTime();

  if (difference > 86400000) {
    return format(oldDate, "dd/MM/yyyy HH:mm a");
  }

  return formatDistance(oldDate, currentDate) + " ago";
}
