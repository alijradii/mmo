import { Entity } from "../../entities/entity";
import { Action } from "../core/action";

export class IdleAction extends Action {
  constructor(entity: Entity) {
    const conditions: Record<string, any> = {};
    const effects: Record<string, any> = { state: "idle" };

    super("idle", 1, conditions, effects, entity);

    this.state = "idle";
    this.duration = 20;
  }

  perform(): void {
    if (!this.entity) return;
    this.timer++;

    if (this.timer >= this.duration) {
      this.finished = true;
    }

    console.log(`${this.entity.id} is idling`);
  }
}
