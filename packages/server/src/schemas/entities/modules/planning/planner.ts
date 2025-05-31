import { Entity } from "../../entity";
import { rangedCombatPlanner } from "../combat/rangedPlanner";

export class Planner {
  public entity: Entity;
  public hostileEntities: Entity[] = [];
  public isThinking = false;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  async think() {
    rangedCombatPlanner(this.entity);
  }
}
