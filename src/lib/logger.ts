import chalk from "chalk";
import { env } from "./env";
import { formatDate } from "./utils/date";

export default class Logger {
  private static readonly LogLevel = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static readonly LogColors = {
    debug: chalk.blue,
    info: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
  };

  /**
   * Checks if a log level should be logged.
   *
   * @param level the log level to check
   * @returns true if the log level should be logged, false otherwise
   */
  private static shouldLog(level: keyof typeof Logger.LogLevel): boolean {
    const configuredLevel = env.LOG_LEVEL || "info";
    return Logger.LogLevel[level] >= Logger.LogLevel[configuredLevel];
  }

  /**
   * Logs a message at the specified level.
   *
   * @param level the log level
   * @param message the message to log
   */
  private static log(
    level: keyof typeof Logger.LogLevel,
    message: unknown,
    ...args: unknown[]
  ): void {
    if (!Logger.shouldLog(level)) {
      return;
    }

    const color = Logger.LogColors[level];
    const timestamp = formatDate(new Date(), "HH:mm:ss");
    console.log(
      `${color(level.toUpperCase())} ${chalk.gray(timestamp)} ${message}`,
      ...args
    );
  }

  /**
   * Logs a debug message.
   *
   * @param message the message to log
   */
  public static debug(message: unknown, ...args: unknown[]): void {
    Logger.log("debug", message, ...args);
  }

  /**
   * Logs an info message.
   *
   * @param message the message to log
   */
  public static info(message: unknown, ...args: unknown[]): void {
    Logger.log("info", message, ...args);
  }

  /**
   * Logs a warning message.
   *
   * @param message the message to log
   */
  public static warn(message: unknown, ...args: unknown[]): void {
    Logger.log("warn", message, ...args);
  }

  /**
   * Logs an error message.
   *
   * @param message the message to log
   */
  public static error(message: unknown, ...args: unknown[]): void {
    Logger.log("error", message, ...args);
  }
}
