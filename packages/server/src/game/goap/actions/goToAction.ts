import { PathFindAction } from "./pathFindAction";
import { Entity } from "../../entities/entity";

export class GoToAction extends PathFindAction {
  constructor(
    entity: Entity,
    private targetTile: { x: number; y: number },
    arriveRadius = 4
  ) {
    super(
      "go_to",
      10,
      {},
      { [`at_${targetTile.x}_${targetTile.y}`]: true },
      entity,
      arriveRadius
    );
  }

  protected getTargetCoord(): { x: number; y: number } {
    return { x: this.targetTile.x * this.tileSize + this.tileSize / 2, y: this.targetTile.y * this.tileSize + this.tileSize / 2 };
  }

  protected onArrive(): void {
    // no additional effects beyond finish
  }
}