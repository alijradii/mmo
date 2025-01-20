import { Entity } from "./entity";

export class State {
  public entity: Entity;
  public name: string;
  
  isLocked: boolean = false;

  constructor(name: string, entity: Entity) {
    this.name = name;
    this.entity = entity;
  }

  update() {}

  onEnter() {}

  onExit() {}
}
