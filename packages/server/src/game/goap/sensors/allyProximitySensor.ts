import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";
import { getManhattanDistance } from "../../../utils/math/helpers";

export class AllyProximitySensor implements Sensor {
  private readonly detectionRange: number;
  private readonly assistRange: number;

  constructor(detectionRange = 500, assistRange = 100) {
    this.detectionRange = detectionRange;
    this.assistRange = assistRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const allies = others
      .filter(
        (e) =>
          e.id !== self.id &&
          e.party === self.party &&
          getManhattanDistance({ ax: self.x, ay: self.y, bx: e.x, by: e.y }) <=
            this.detectionRange
      )
      .sort(
        (a, b) => a.HP / (a.finalStats.HP || 1) - b.HP / (b.finalStats.HP || 1)
      );

    let closest: Entity | null = null;
    let closestDist = Infinity;

    for (const ally of allies) {
      const dx = ally.x - self.x;
      const dy = ally.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closest = ally;
        closestDist = dist;
      }
    }

    if (closest && closestDist <= this.detectionRange) {
      worldState["ally_detected"] = true;
      worldState["ally_id"] = closest.id;
      worldState[`distance_${closest.id}`] = closestDist;

      if (closestDist <= 12) {
        worldState[`within_bounds_${closest.id}`] = true;
        worldState[`within_range_${closest.id}`] = true;
      } else if (closestDist <= this.assistRange) {
        worldState[`within_bounds_${closest.id}`] = false;
        worldState[`within_range_${closest.id}`] = true;
      } else {
        worldState[`within_bounds_${closest.id}`] = false;
        worldState[`within_range_${closest.id}`] = false;
      }
    } else {
      worldState["ally_detected"] = false;
      delete worldState["ally_id"];
    }
  }

  onTargetChange(entity: Entity | null): void {
    if (!entity) return;
  }
}
