import { Entity } from "../../entity";
import { meleePlanner } from "../combat/meleePlanner";
import { rangedCombatPlanner } from "../combat/rangedPlanner";

export class Planner {
  public entity: Entity;
  public hostileEntities: Entity[] = [];
  public isThinking = false;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  async think() {
    if (this.entity.autoAttack.weapon?.ranged) rangedCombatPlanner(this.entity);
    else meleePlanner(this.entity);
  }
}
