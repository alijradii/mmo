import { GameRoom } from "../rooms/gameRoom";
import { Rectangle } from "../utils/hitboxes";
import { Schema, type } from "@colyseus/schema";

export class Entity extends Schema {
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

  update(room: GameRoom) {}

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
