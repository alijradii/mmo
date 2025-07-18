import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";
import { getEuclideanDistance } from "../../../utils/math/helpers";

export class AllyProximitySensor implements Sensor {
  private readonly detectionRange: number;
  private readonly assistRange: number;

  constructor(detectionRange = 500, assistRange = 120) {
    this.detectionRange = detectionRange;
    this.assistRange = assistRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const allies = others
      .filter(
        (e) =>
          e.id !== self.id &&
          e.party === self.party &&
          getEuclideanDistance({ ax: self.x, ay: self.y, bx: e.x, by: e.y }) <=
            this.detectionRange
      )
      .sort(
        (a, b) => a.HP / (a.finalStats.HP || 1) - b.HP / (b.finalStats.HP || 1)
      );

    const lowestHpAlly = allies[0];

    if (lowestHpAlly) {
      const dx = lowestHpAlly.x - self.x;
      const dy = lowestHpAlly.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hpPercent =
        (100 * lowestHpAlly.HP) / (lowestHpAlly.finalStats.HP || 1);

      worldState["ally_detected"] = true;
      worldState["ally_id"] = lowestHpAlly.id;
      worldState[`distance_${lowestHpAlly.id}`] = dist;
      worldState["ally_hp_percent"] = hpPercent;

      if (dist <= 12) {
        worldState[`within_bounds_${lowestHpAlly.id}`] = true;
        worldState[`within_range_${lowestHpAlly.id}`] = true;
      } else if (dist <= this.assistRange) {
        worldState[`within_bounds_${lowestHpAlly.id}`] = false;
        worldState[`within_range_${lowestHpAlly.id}`] = true;
      } else if (dist <= this.detectionRange) {
        worldState[`within_bounds_${lowestHpAlly.id}`] = false;
        worldState[`within_range_${lowestHpAlly.id}`] = false;
      }
    } else {
      worldState["ally_detected"] = false;
      delete worldState["ally_id"];
      delete worldState["ally_hp_percent"];
    }
  }

  onTargetChange(entity: Entity | null): void {
    if (!entity) return;
  }
}
