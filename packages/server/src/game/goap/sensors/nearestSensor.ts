import type { Sensor } from "./sensor";
import type { Entity } from "../../entities/entity";
import type { WorldState } from "../core/worldState";

export class NearestSensor implements Sensor {
  update(worldState: WorldState, self: Entity, others: Entity[]): void {
    const candidates = others.filter((e) => e.id !== self.id);

    let closest: Entity | null = null;
    let closestDist = Infinity;

    for (const entity of candidates) {
      if(entity.party === -1) continue;

      const dx = entity.x - self.x;
      const dy = entity.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closest = entity;
        closestDist = dist;
      }
    }

    if (closest && closestDist < 200) {
      worldState["distance"] = closestDist;
      worldState["entity_id"] = closest.id;
      worldState["danger"] = true;
    } else {
      delete worldState["distance"];
      delete worldState["entity_id"];
    }
  }

  onTargetChange(): void {
  }
}
