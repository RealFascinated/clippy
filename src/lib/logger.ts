import chalk from "chalk";
import { formatDate } from "./utils/date";
import { env } from "./env";

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

  private static readonly LogSymbols = {
    debug: "🔍",
    info: "ℹ️",
    warn: "⚠️",
    error: "❌",
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
    message: string,
    args?: any[]
  ): void {
    if (!Logger.shouldLog(level)) {
      return;
    }

    const color = Logger.LogColors[level];
    const symbol = Logger.LogSymbols[level];
    const timestamp = formatDate(new Date(), "HH:mm:ss");
    console.log(
      `${color(level.toUpperCase())} ${symbol} ${chalk.gray(timestamp)} ${message}`,
      ...(args || [])
    );
  }

  /**
   * Logs a debug message.
   *
   * @param message the message to log
   */
  public static debug(message: string, args?: any[]): void {
    Logger.log("debug", message);
  }

  /**
   * Logs an info message.
   *
   * @param message the message to log
   */
  public static info(message: string, args?: any[]): void {
    Logger.log("info", message, args);
  }

  /**
   * Logs a warning message.
   *
   * @param message the message to log
   */
  public static warn(message: string, args?: any[]): void {
    Logger.log("warn", message, args);
  }

  /**
   * Logs an error message.
   *
   * @param message the message to log
   */
  public static error(message: string, args?: any[]): void {
    Logger.log("error", message, args);
  }
}
