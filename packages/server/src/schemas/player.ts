import { Vector } from "vecti";
import { Schema, type } from "@colyseus/schema";
import { GameRoom } from "@/rooms/gameRoom";
import { Rectangle } from "@/utils/hitboxes";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  direction: "up" | "down" | "left" | "right";
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

  hurtboxWidth: number = 18;
  hurtboxHeight: number = 26;
  hitBoxWidth: number = 32;
  hitBoxHeight: number = 32;

  public inputQueue: PlayerInput[] = [];

  update(room: GameRoom) {
    this.updateInput(room);
  }

  updateInput(room: GameRoom) {
    const currentTick = room.state.tick;
    if (this.lockedCount > 0) {
      this.lockedCount--;

      if (this.lockedCount === 0) this.onLockRemove();
      return;
    }
    let input: PlayerInput | undefined;
    let willAttack: boolean = false;
    while ((input = this.inputQueue.shift())) {
      this.direction = input.direction;
      if (input.attack) {
        willAttack = true;
      }

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

    if (willAttack && currentTick - this.lastAttackTick > 40) {
      this.state = "attack";
      this.lastAttackTick = currentTick;
      room.handleAttack(this);
      this.lockedCount = 20;
    }
  }

  onLockRemove() {
    this.state = "idle";
  }

  getHurtBoxRect(): Rectangle {
    return {
      x: this.x - this.hurtboxWidth / 2,
      y: this.y - this.hurtboxHeight / 2,
      width: this.hurtboxWidth,
      height: this.hurtboxHeight,
    };
  }

  getHitBoxRect(): Rectangle {
    let xoffset = 0;
    let yoffset = 0;

    switch (this.direction) {
      case "up":
        [xoffset, yoffset] = [0, -11];
        break;
      case "down":
        [xoffset, yoffset] = [0, 6];
        break;
      case "left":
        [xoffset, yoffset] = [-6, 0];
        break;
      case "right":
        [xoffset, yoffset] = [11, 0];
    }

    return {
      x: this.x - this.hitBoxWidth / 2 + xoffset,
      y: this.y - this.hitBoxHeight / 2 + yoffset,
      width: this.hitBoxWidth,
      height: this.hitBoxHeight,
    };
  }
}
