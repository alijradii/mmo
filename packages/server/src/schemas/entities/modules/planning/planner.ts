import { getManhattanDistance } from "../../../../utils/math/helpers";
import { Entity } from "../../entity";
import { meleePlanner } from "../combat/meleePlanner";
import { rangedCombatPlanner } from "../combat/rangedPlanner";

export class Planner {
  public entity: Entity;
  public hostileEntities: Entity[] = [];
  public isThinking = false;
  public detectRange = 500;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  async think() {
    const entities: Entity[] = this.entity.world.getAllEntites().filter(
      (e) =>
        e.party !== this.entity.party &&
        getManhattanDistance({
          ax: e.x,
          ay: e.y,
          bx: this.entity.x,
          by: this.entity.y,
        }) > this.detectRange
    );

    this.hostileEntities = entities;

    if (this.entity.autoAttack.weapon?.ranged) rangedCombatPlanner(this.entity);
    else meleePlanner(this.entity);
  }
}
