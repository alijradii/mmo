import { PathFindAction } from "./pathFindAction";
import { Entity } from "../../entities/entity";

export class FollowEntityAction extends PathFindAction {
  constructor(entity: Entity, private target: Entity, arriveRadius = 32) {
    super(
      `follow_entity_${target.id}`,
      10,
      {},
      {
        [`within_bounds_${target.id}`]: true,
        [`within_range_${target.id}`]: true,
      },
      entity,
      arriveRadius
    );
  }

  protected getTargetCoord(): { x: number; y: number } {
    return { x: this.target.x, y: this.target.y };
  }

  protected onArrive(): void {
    // custom logic on arriving
  }
}
