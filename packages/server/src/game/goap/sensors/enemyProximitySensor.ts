import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";

export class EnemyProximitySensor implements Sensor {
  private readonly detectionRange: number;
  public readonly attackRange: number;

  constructor(detectionRange = 500, attackRange = 100) {
    this.detectionRange = detectionRange;
    this.attackRange = attackRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const allRelevantEntities = others.filter((e) => e.id !== self.id);

    const enemies = allRelevantEntities.filter((e) => e.party !== self.party);

    let closest: Entity | null = null;
    let closestDist = Infinity;

    const seenIds = new Set<string>();
    for (const entity of allRelevantEntities) {
      seenIds.add(entity.id.toString());
    }

    for (const enemy of enemies) {
      const dx = enemy.x - self.x;
      const dy = enemy.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      worldState[`distance_${enemy.id}`] = dist;

      if (dist <= 12) {
        worldState[`within_bounds_${enemy.id}`] = true;
        worldState[`within_range_${enemy.id}`] = true;
      } else if (dist <= this.attackRange) {
        worldState[`within_bounds_${enemy.id}`] = false;
        worldState[`within_range_${enemy.id}`] = true;
      } else {
        worldState[`within_bounds_${enemy.id}`] = false;
        worldState[`within_range_${enemy.id}`] = false;
      }

      if (dist < closestDist) {
        closest = enemy;
        closestDist = dist;
      }
    }

    if (closest && closestDist <= this.detectionRange) {
      worldState["enemy_detected"] = true;
      worldState["enemy_id"] = closest.id.toString();
    } else {
      worldState["enemy_detected"] = false;
      delete worldState["enemy_id"];
    }

    // clean up
    for (const key in worldState) {
      const match = key.match(
        /^(distance|within_bounds|within_range|attack|follow|support|within_sight)_(\d+)$/
      );
      if (match) {
        const [, , id] = match;
        if (!seenIds.has(id)) {
          delete worldState[key];
        }
      }
    }
  }

  onTargetChange(entity: Entity | null): void {
    if (!entity) return;
  }
}
