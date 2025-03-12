import chalk from "chalk";

/**
 * Get the appropriate color function for HTTP status codes
 * @param statusCode HTTP status code
 * @returns chalk color function
 */
export function getStatusColor(statusCode: number) {
  return statusCode >= 500
    ? chalk.red
    : statusCode >= 400
      ? chalk.yellow
      : statusCode >= 300
        ? chalk.cyan
        : chalk.green;
}

/**
 * Get the appropriate color function for response times
 * @param timeMs response time in milliseconds
 * @returns chalk color function
 */
export function getResponseTimeColor(timeMs: number) {
  return timeMs > 500 ? chalk.red : timeMs > 250 ? chalk.yellow : chalk.green;
}
