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
  maxSpeed: number = 300;

  @type("number")
  colliderWidth: number = 0;

  @type("number")
  colliderHeight: number = 0;

  _room: GameRoom;

  constructor(room: GameRoom) {
    super();

    this._room = room;
  }

  getColliderRect(): Rectangle {
    return {
      x: this.loc.x - this.colliderWidth / 2,
      y: this.loc.y - this.colliderHeight / 2,
      width: this.colliderWidth,
      height: this.colliderHeight,
    };
  }

  physicsUpdate() {
    let friction = this.friction;

    let accelVec = Vec2MultiplyByScalar(
      this.maxSpeed * 10 * friction * this.accelSpeed * tickInterval,
      { x: this.accelDir.x, y: this.accelDir.y }
    );

    let frictionVec = Vec2MultiplyByScalar(friction * 12 * tickInterval, {
      x: this.speed.x,
      y: this.speed.y,
    });

    if (
      this.speed.x * this.speed.x + this.speed.y * this.speed.y <=
      this.maxSpeed * this.maxSpeed
    ) {
      const dot = Vec2Dot(this.accelDir, frictionVec);

      if (dot >= 0)
        frictionVec = Vec2Sub(frictionVec, Vec2MultiplyByScalar(dot, accelVec));
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

    this.loc.x += this.speed.x * tickInterval;
    this.loc.y += this.speed.y * tickInterval;
  }
}
