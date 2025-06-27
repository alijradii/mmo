import { Entity } from "../../entities/entity";
import { WorldState } from "./worldState";

export class Action {
  public cost: number = 1;
  public name: string;
  public state: string = "idle";

  public preconditions: Partial<WorldState>;
  public effects: Partial<WorldState>;
  public terminateEffects: Partial<WorldState>;

  public entity?: Entity;

  public started: boolean = false;
  public finished: boolean = false;
  public failed: boolean = false;
  public timer: number = 0;
  public duration: number = 0;
  
  constructor(
    name: string,
    cost: number,
    preconditions: Partial<WorldState>,
    effects: Partial<WorldState>,
    entity?: Entity
  ) {
    this.name = name;
    this.cost = cost;
    this.preconditions = preconditions;
    this.effects = effects;

    this.entity = entity;

    this.terminateEffects = {};
  }

  checkProceduralPrecondition(): boolean {
    return true;
  }

  start() {
    this.started = true;
    this.finished = false;
    this.failed = false;
    this.timer = 0;

    if (this.entity) {
      this.entity.state = this.state;
    }
  }

  end() {
    this.finished = true;
  }

  perform() {}

  toString() {
    return this.name;
  }
}
