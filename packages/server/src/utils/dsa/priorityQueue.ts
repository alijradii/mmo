export class PriorityQueue<T> {
  private items: { priority: number; value: T }[] = [];

  put(priority: number, value: T): void {
    this.items.push({ priority, value });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  get(): T {
    return this.items.shift()!.value;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
