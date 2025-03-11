export default abstract class Queue<T> {
  public queue: T[] = [];
  private activeProcesses: number = 0;
  private isProcessing = false;

  constructor(
    processInterval: number,
    private concurrency: number = 1
  ) {
    setInterval(async () => {
      if (this.isProcessing || !Array.isArray(this.queue)) {
        return;
      }

      this.isProcessing = true;

      try {
        // Process multiple items concurrently up to the concurrency limit
        while (
          this.queue.length > 0 &&
          this.activeProcesses < this.concurrency
        ) {
          const item = this.queue.shift();
          if (!item) break;

          this.activeProcesses++;
          // Process item without awaiting to allow concurrent execution
          this.process(item)
            .catch(error => {
              console.error("Error processing queue item:", error);
            })
            .finally(() => {
              this.activeProcesses--;
            });
        }
      } finally {
        this.isProcessing = false;
      }
    }, processInterval);
  }

  /**
   * Add an item to the queue
   *
   * @param item the item to add to the queue
   */
  add(item: T) {
    if (!Array.isArray(this.queue)) {
      this.queue = [];
    }
    this.queue.push(item);
  }

  abstract process(item: T): Promise<void>;
}
