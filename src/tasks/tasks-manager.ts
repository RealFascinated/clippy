import Logger from "@/lib/logger";
import cron from "node-cron";
import UserMetricsTask from "./impl/user-metrics-task";
import Task from "./task";

export default class TasksManager {
  tasks: Task[] = [];

  constructor() {
    this.registerTask(new UserMetricsTask());

    this.tasks.forEach(task => {
      cron.schedule(
        task.cron,
        async () => {
          if (task.running) {
            Logger.warn(`Task ${task.name} is already running, skipping task.`);
            return;
          }

          Logger.info(`Running task ${task.name}`);
          task.running = true;
          await task.run();
          task.running = false;
        },
        {
          runOnInit: false,
        }
      );
    });
  }

  /**
   * Registers a new task
   *
   * @param task the task to register
   */
  private registerTask(task: Task) {
    this.tasks.push(task);
    Logger.info(`Registered the task "${task.name}" (${task.cron})`);
  }
}
