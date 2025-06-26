import { getManhattanDistance } from "../../../utils/math/helpers";
import { Entity } from "../../entities/entity";
import { Action } from "../core/action";

export class GoToAction extends Action {
  x: number = 0;
  y: number = 0;

  constructor(entity: Entity, x: number, y: number, target: string) {
    const conditions: Record<string, any> = { state: "idle" };
    const effects: Record<string, any> = {};

    effects[`nearTargetLocation_${target}`] = true;
    effects[`atTargetLocation_${target}`] = true;

    super(`goTo_${target}`, 1, conditions, effects, entity);

    this.x = x;
    this.y = y;
  }

  perform(): void {
    if (!this.entity) return;

    if (
      getManhattanDistance({
        ax: this.entity.x,
        ay: this.entity.y,
        bx: this.x,
        by: this.y,
      }) < 40
    ) {
      this.end();
      return;
    }

    if (this.entity.x < this.x) {
      this.entity.x += 5;
    }
    if (this.entity.x > this.x) {
      this.entity.x -= 5;
    }

    if (this.entity.y < this.y) {
      this.entity.y += 5;
    }
    if (this.entity.y > this.y) {
      this.entity.y -= 5;
    }
  }
}
