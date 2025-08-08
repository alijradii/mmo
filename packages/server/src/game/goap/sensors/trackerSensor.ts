import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";
import { getEuclideanDistance } from "../../../utils/math/helpers";

export class TrackerSensor implements Sensor {
  private readonly targetId: string;
  private readonly detectionRange: number;
  private readonly interactionRange: number;

  constructor(targetId: string, detectionRange = 500, interactionRange = 100) {
    this.targetId = targetId;
    this.detectionRange = detectionRange;
    this.interactionRange = interactionRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const target = others.find((e) => e.id.toString() === this.targetId);

    if (target) {
      const dist = getEuclideanDistance({
        ax: self.x,
        ay: self.y,
        bx: target.x,
        by: target.y,
      });

      worldState["entity_id"] = target.id;
      worldState["distance"] = dist;

      if (dist <= 12) {
        worldState[`within_bounds_${target.id}`] = true;
        worldState[`within_range_${target.id}`] = true;
      } else if (dist <= this.interactionRange) {
        worldState[`within_bounds_${target.id}`] = false;
        worldState[`within_range_${target.id}`] = true;
      } else if (dist <= this.detectionRange) {
        worldState[`within_bounds_${target.id}`] = false;
        worldState[`within_range_${target.id}`] = false;
      }
    }
  }

  onTargetChange(): void {
    // No dynamic target switching for this sensor
  }
}
