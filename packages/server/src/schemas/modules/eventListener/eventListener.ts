export class EventListener {
  listeners: Map<string, (value: any) => {}> = new Map<
    string,
    (value: any) => {}
  >();
  
  addListener() {}
  removeListener() {}
  emitEvent() {}
}
