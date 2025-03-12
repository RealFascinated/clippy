import { format } from "date-fns";
import { env } from "./env";
import chalk from "chalk";

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
   * Logs a message to the console.
   *
   * @param level the log level to use
   * @param message the message to log
   * @param args the arguments to log
   */
  public static log(
    level: keyof typeof Logger.LogLevel,
    message: unknown,
    ...args: unknown[]
  ) {
    if (!Logger.shouldLog(level)) {
      return;
    }

    const timestamp = chalk.gray(format(new Date(), "dd/MM/yyyy, HH:mm:ss"));
    const symbol = Logger.LogSymbols[level];
    const levelColor = Logger.LogColors[level];
    const levelText = levelColor.bold(`[${level.toUpperCase()}]`);
    const appName = chalk.cyan("[Clippy]");

    const prefix = `${timestamp} ${appName} ${levelText} ${symbol}`;
    const formattedMessage = `${prefix} ${message}`;

    switch (level) {
      case "debug":
        console.debug(formattedMessage, ...args);
        break;
      case "info":
        console.info(formattedMessage, ...args);
        break;
      case "warn":
        console.warn(formattedMessage, ...args);
        break;
      case "error":
        console.error(formattedMessage, ...args);
        break;
    }
  }

  public static debug(message: unknown, ...args: unknown[]) {
    Logger.log("debug", message, ...args);
  }

  public static info(message: unknown, ...args: unknown[]) {
    Logger.log("info", message, ...args);
  }

  public static warn(message: unknown, ...args: unknown[]) {
    Logger.log("warn", message, ...args);
  }

  public static error(message: unknown, ...args: unknown[]) {
    Logger.log("error", message, ...args);
  }
}
