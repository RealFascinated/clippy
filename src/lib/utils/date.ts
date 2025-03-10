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
