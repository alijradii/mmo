import { Entity } from "../entity";
import { toTile } from "../modules/pathfinding/pathUtils";
import { PathFindState } from "./pathFindState";

export class ChaseState extends PathFindState {
  public target: Entity;

  constructor(
    entity: Entity,
    target: Entity,
    arriveRadius = 4
  ) {
    super("chase", entity, arriveRadius);
    this.target = target;
  }

  protected getTargetTile() {
    return toTile(this.target.x, this.target.y);
  }

  protected onArrive() {
    this.onCaught();
  }

  onCaught() {
    this.entity.setState(this.entity.idleState);
  }
}
