import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";

export class EnemyProximitySensor implements Sensor {
  private readonly detectionRange: number;
  private readonly attackRange: number;

  constructor(detectionRange = 500, attackRange = 100) {
    this.detectionRange = detectionRange;
    this.attackRange = attackRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const enemies = others.filter((e) => e.party !== self.party);

    let closest: Entity | null = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      const dx = enemy.x - self.x;
      const dy = enemy.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closest = enemy;
        closestDist = dist;
      }
    }

    if (closest && closestDist <= this.detectionRange) {
      worldState["enemy_detected"] = true;
      worldState["enemy_id"] = closest.id;
      worldState[`distance_${closest.id}`] = closestDist;

      if (closestDist <= 5) {
        worldState[`within_bounds_${closest.id}`] = true;
        worldState[`within_range_${closest.id}`] = true;
      }
      else if (closestDist <= this.attackRange) {
        worldState[`within_bounds_${closest.id}`] = false;
        worldState[`within_range_${closest.id}`] = true;
      } else {
        worldState[`within_bounds_${closest.id}`] = false;
        worldState[`within_range_${closest.id}`] = false;
      }
    } else {
      worldState["enemy_detected"] = false;
      delete worldState["enemy_id"];
    }
  }

  onTargetChange(entity: Entity | null): void {
    if (!entity) return;
  }
}
