import { PathFindAction } from "./pathFindAction";
import { Entity } from "../../entities/entity";
import { isValidTile } from "../../entities/modules/pathfinding/pathUtils";

export class FleeAction extends PathFindAction {
  private fleeDistance: number;
  private threat: Entity;

  constructor(
    entity: Entity,
    threat: Entity,
    fleeDistance = 200,
    arriveRadius = 4
  ) {
    const preconditions = {};

    const effects = {
      [`within_range_${threat.id}`]: false,
      [`within_bounds_${threat.id}`]: false,
      "danger": false
    };

    super("flee", 8, preconditions, effects, entity, arriveRadius);
    this.threat = threat;
    this.fleeDistance = fleeDistance;
  }

  protected getTargetCoord(): { x: number; y: number } {
    const self = this.entity;

    if(!self) throw new Error("Trying to flee with no entity object");

    const hmap = self.world.mapInfo.heightmap;
    const tileSize = this.tileSize;
    const maxSearchRadius = 5; // how far out (in tiles) to search

    // 1) Raw flee point
    const dx = self.x - this.threat.x;
    const dy = self.y - this.threat.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist,
      uy = dy / dist;
    const rawX = self.x + ux * this.fleeDistance;
    const rawY = self.y + uy * this.fleeDistance;

    // 2) Convert to tile coords
    let tx = Math.floor(rawX / tileSize);
    let ty = Math.floor(rawY / tileSize);

    // 3) If that tile is not valid or not walkable, search nearby
    if (!isValidTile({ x: tx, y: ty }, hmap) || hmap[ty]?.[tx] !== 1) {
      let found = false;
      for (let r = 1; r <= maxSearchRadius && !found; r++) {
        for (let ox = -r; ox <= r && !found; ox++) {
          for (let oy = -r; oy <= r && !found; oy++) {
            const nx = tx + ox;
            const ny = ty + oy;
            if (isValidTile({ x: nx, y: ny }, hmap) && hmap[ny]?.[nx] === 1) {
              tx = nx;
              ty = ny;
              found = true;
            }
          }
        }
      }
      // if still not found, we just stick with the original tile
    }

    // 4) Return the center of the chosen tile in world coordinates
    return {
      x: tx * tileSize + tileSize / 2,
      y: ty * tileSize + tileSize / 2,
    };
  }

  protected onArrive(): void {
    // could trigger a state change, e.g., resume normal AI
  }
}
