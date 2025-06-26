import { Entity } from "../../entities/entity";
import { Action } from "./action";
import { Goal } from "./goal";
import { WorldState } from "./worldState";

export class GoapAgent {
  public entity: Entity;

  public actions: Action[] = [];
  public goals: Goal[] = [];
  public worldState: Partial<WorldState> = {};

  constructor(entity: Entity) {
    this.entity = entity;
  }
}
