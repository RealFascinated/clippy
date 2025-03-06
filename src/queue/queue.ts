export default abstract class Queue<T> {
  public queue: T[];
  private isProcessing = false;

  constructor(processInterval: number) {
    this.queue = [];

    setInterval(async () => {
      if (this.isProcessing || !Array.isArray(this.queue)) {
        return;
      }

      const item = this.queue.length > 0 ? this.queue.shift() : undefined;
      if (!item) {
        this.isProcessing = false;
        return;
      }

      try {
        this.isProcessing = true;
        await this.process(item);
      } catch (error) {
        console.error("Error processing queue item:", error);
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
