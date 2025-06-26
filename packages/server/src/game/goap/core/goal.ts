import { Entity } from "../../entities/entity";
import { WorldState } from "./worldState";

export class Goal {
  public name: string;
  public priority: number;
  public desiredState: Partial<WorldState>;
  public presistent: boolean = false;
  public entity?: Entity;

  constructor(
    name: string,
    priority: number,
    desiredState: Partial<WorldState>,
    entity?: Entity
  ) {
    this.name = name;
    this.priority = priority;
    this.desiredState = desiredState;

    this.entity = entity;
  }

  getPriority() {
    return this.priority;
  }
}
