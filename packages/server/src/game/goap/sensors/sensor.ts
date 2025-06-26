import { Entity } from "../../entities/entity";
import { WorldState } from "../core/worldState";

export interface Sensor {
  update(worldState: WorldState, self: Entity, others: Entity[]): void;

  onTargetChange(entity: Entity | null): void; 
}
