import { Rectangle } from "../../utils/hitboxes";
import { GameObject } from "./gameObject";
import { Vector } from "../structures/vector";
import { type } from "@colyseus/schema";
import { GameRoom } from "../../rooms/gameRoom";
import {
  Vec2Dot,
  Vec2Limit,
  Vec2MultiplyByScalar,
  Vec2Sub,
} from "../../utils/math/vec2";
import { Vec3 } from "../../utils/math/vec3";

const tickInterval = 20 / 1000;

export class RigidBody extends GameObject {
  speed: Vec3 = { x: 0, y: 0, z: 0 };

  accelSpeed: number = 1;
  accelDir: Vec3 = { x: 0, y: 0, z: 0 };

  airFriction: number = 0.2;
  friction: number = 1;

  @type("number")
  maxSpeed: number = 120;

  @type("number")
  minSpeed: number = 0.2;

  @type("number")
  colliderWidth: number = 0;

  @type("number")
  colliderHeight: number = 0;

  world: GameRoom;

  constructor(room: GameRoom) {
    super();

    this.world = room;
  }

  getColliderRect(): Rectangle {
    return {
      x: this.x - this.colliderWidth / 2,
      y: this.y - this.colliderHeight / 2,
      width: this.colliderWidth,
      height: this.colliderHeight,
    };
  }

  updatePhysics() {
    let friction = this.friction;

    let accelVec = Vec2MultiplyByScalar(
      this.maxSpeed * 10 * friction * this.accelSpeed * tickInterval,
      { x: this.accelDir.x, y: this.accelDir.y }
    );

    let frictionVec = Vec2MultiplyByScalar(friction * 12 * tickInterval, {
      x: this.speed.x,
      y: this.speed.y,
    });

    let velLength = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2);
    if (velLength <= this.maxSpeed) {
      let dot = Vec2Dot(this.accelDir, frictionVec);
      if (dot >= 0) {
        frictionVec = Vec2Sub(
          frictionVec,
          Vec2MultiplyByScalar(dot, { x: this.accelDir.x, y: this.accelDir.y })
        );
      }
    }

    this.speed.x += accelVec.x;
    this.speed.y += accelVec.y;

    const limitedSpeedVec = Vec2Limit(
      { x: this.speed.x, y: this.speed.y },
      this.maxSpeed
    );
    this.speed.x = limitedSpeedVec.x;
    this.speed.y = limitedSpeedVec.y;

    this.speed.x -= frictionVec.x;
    this.speed.y -= frictionVec.y;

    const dx = this.speed.x * tickInterval;
    const dy = this.speed.y * tickInterval;

    if (Math.abs(dx) + Math.abs(dy) < this.minSpeed) {
      this.speed.x = 0;
      this.speed.y = 0;
    } else {
      this.x += dx;
      this.y += dy;
    }
  }
}
