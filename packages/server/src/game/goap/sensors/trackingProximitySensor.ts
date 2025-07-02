import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";
import { getEuclideanDistance } from "../../../utils/math/helpers";

export class TrackingProximitySensor implements Sensor {
  private readonly detectionRange: number;
  private readonly impactRange: number;

  constructor(detectionRange = 500, impactRange = 120) {
    this.detectionRange = detectionRange;
    this.impactRange = impactRange;
  }

  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    if (!worldState["is_tracking"]) {
      return;
    }

    const entities = others.filter((e) => e.id !== self.id);
    const trackedId = worldState["tracked_id"];

    if (!trackedId) return;

    const trackedEntity = entities.find((e) => e.id === trackedId);

    if (!trackedEntity) {
        worldState["is_tracking"] = false;
        delete worldState["tracked_id"];
        return;
    }

    const dx = trackedEntity.x - self.x;
    const dy = trackedEntity.y - self.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 12) {
      worldState[`within_bounds_${trackedEntity.id}`] = true;
      worldState[`within_range_${trackedEntity.id}`] = true;
    } else if (dist <= this.impactRange) {
      worldState[`within_bounds_${trackedEntity.id}`] = false;
      worldState[`within_range_${trackedEntity.id}`] = true;
    } else if (dist <= this.detectionRange) {
      worldState[`within_bounds_${trackedEntity.id}`] = false;
      worldState[`within_range_${trackedEntity.id}`] = false;
    }
  }

  onTargetChange(entity: Entity | null): void {
    if (!entity) return;
  }
}
