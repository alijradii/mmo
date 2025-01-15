import { Vector } from "vecti";
import { Schema, type } from "@colyseus/schema";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  attack?: boolean;

  tick: number;
}

export class Player extends Schema {
  @type("string")
  id: string = "";

  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("string")
  direction: string = "up";

  @type("number")
  tick: number = 0;

  @type("string")
  state = "idle";

  @type("number")
  lockedCount: number = 0;

  @type("number")
  lastAttackTick: number = 0;

  @type("number")
  velocity: number = 3.2;

  public inputQueue: PlayerInput[] = [];

  update(currentTick: number) {
    this.updateInput(currentTick);
  }

  updateInput(currentTick: number) {
    if (this.lockedCount > 0) {
      this.lockedCount--;

      if (this.lockedCount === 0) this.onLockRemove();
      return;
    }
    let input: PlayerInput;
    let willAttack: boolean = false;
    while ((input = this.inputQueue.shift())) {
      if (input.attack) willAttack = true;

      let dx = 0;
      let dy = 0;

      if (input.left) {
        dx = -1;
      } else if (input.right) {
        dx = 1;
      }

      if (input.up) {
        dy = -1;
      } else if (input.down) {
        dy = 1;
      }

      if (dx != 0 || dy != 0) {
        const delta = new Vector(dx, dy).normalize();

        this.x += delta.x * this.velocity;
        this.y += delta.y * this.velocity;
      }

      this.tick = input.tick;
    }

    if (willAttack) {
      this.state = "attack";
      this.lastAttackTick = this.tick;
      this.lockedCount = 20;
    }
  }

  onLockRemove() {
    this.state = "idle";
  }
}
