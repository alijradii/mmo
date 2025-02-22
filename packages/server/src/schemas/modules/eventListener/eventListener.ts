export interface Event {
  name: string;
  value: any;
}

export class EventListener {
  listeners: Map<string, (value: Event) => {}> = new Map<
    string,
    (value: Event) => {}
  >();

  addListener(name: string, listener: (value: Event) => {}) {
    this.listeners.set(name, listener);
  }

  removeListener(name: string) {
    this.listeners.delete(name);
  }

  emitEvent(event: Event) {
    this.listeners.forEach((callback) => {
      callback(event);
    });
  }
}
