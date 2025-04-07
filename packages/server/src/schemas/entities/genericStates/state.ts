import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";

interface StateOverrides {
  maxSpeed?: number;
}

export class State {
  public name: string;
  public entity: Entity;
  public world: GameRoom;

  isLocked: boolean = false;
  stateOverrides: StateOverrides = {};

  constructor(name: string, entity: Entity) {
    this.name = name;
    this.entity = entity;
    this.world = entity.world;
  }

  update() {}

  onEnter() {}

  onExit() {}

  isValid() {
    return true;
  }
}
