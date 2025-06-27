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

  start(): void {
    super.start();

    if (this.entity) {
      this.entity.accelDir.x = 0;
      this.entity.accelDir.y = 0;
      this.entity.xVelocity = 0;
      this.entity.yVelocity = 0;
    }
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
