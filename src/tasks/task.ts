import Logger from "@/lib/logger";

export default abstract class Task {
  /**
   * The name of this task.
   */
  name: string;

  /**
   * How often to run this task.
   */
  cron: string;

  /**
   * Whether this task is running or not.
   */
  running: boolean = false;

  constructor(name: string, cron: string) {
    this.name = name;
    this.cron = cron;
  }

  /**
   * Gets called every time the cron
   * is scheduled to run.
   */
  abstract run(): Promise<void>;

  /**
   * Logs a message for this task
   *
   * @param message the message to log
   */
  protected log(message: unknown) {
    Logger.info(`(${this.name}) - ${message}`);
  }
}
