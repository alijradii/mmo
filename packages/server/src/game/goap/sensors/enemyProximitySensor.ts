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
    const enemies = others.filter(e => e.party !== self.party);

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
      worldState["enemyDetected"] = true;
      worldState["enemyId"] = closest.id;
      worldState[`distance_${closest.id}`] = closestDist;

      if (closestDist <= this.attackRange) {
        worldState[`inAttackRange_${closest.id}`] = true;
      } else {
        worldState[`inAttackRange_${closest.id}`] = false;
      }

    } else {
      worldState["enemyDetected"] = false;
      delete worldState["enemyId"];
    }
  }

  onTargetChange(entity: Entity | null): void {
    if(!entity)
        return;
  }
}
