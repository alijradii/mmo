import { Rectangle } from "../../utils/hitboxes";
import { GameObject } from "./gameObject";
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
  @type("number")
  xVelocity: number = 0;

  @type("number")
  yVelocity: number = 0;

  @type("number")
  zVelocity: number = 0;

  accelSpeed: number = 1;
  accelDir: Vec3 = { x: 0, y: 0, z: 0 };

  airFriction: number = 0.2;
  friction: number = 1;

  maxSpeed: number = 120;

  minSpeed: number = 0.2;

  colliderWidth: number = 0;

  colliderHeight: number = 0;

  world: GameRoom;

  constructor(room: GameRoom) {
    super();

    this.world = room;
  }

  getFriction(): number {
    return this.friction;
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
    let friction = this.getFriction();

    let accelVec = Vec2MultiplyByScalar(
      this.maxSpeed * 10 * friction * this.accelSpeed * tickInterval,
      { x: this.accelDir.x, y: this.accelDir.y }
    );

    let frictionVec = Vec2MultiplyByScalar(friction * 12 * tickInterval, {
      x: this.xVelocity,
      y: this.yVelocity,
    });

    let velLength = Math.sqrt(this.xVelocity ** 2 + this.yVelocity ** 2);
    if (velLength <= this.maxSpeed) {
      let dot = Vec2Dot(this.accelDir, frictionVec);
      if (dot >= 0) {
        frictionVec = Vec2Sub(
          frictionVec,
          Vec2MultiplyByScalar(dot, { x: this.accelDir.x, y: this.accelDir.y })
        );
      }
    }

    let xVel = this.xVelocity;
    let yVel = this.yVelocity;

    xVel += accelVec.x;
    yVel += accelVec.y;

    const limitedSpeedVec = Vec2Limit(
      { x: this.xVelocity, y: this.yVelocity },
      this.maxSpeed
    );
    xVel = limitedSpeedVec.x;
    yVel = limitedSpeedVec.y;

    xVel -= frictionVec.x;
    yVel -= frictionVec.y;

    const dx = this.xVelocity * tickInterval;
    const dy = this.yVelocity * tickInterval;

    if (Math.abs(dx) + Math.abs(dy) < this.minSpeed) {
      this.xVelocity = 0;
      this.yVelocity = 0;
    } else {
      
      this.xVelocity = xVel;
      this.yVelocity = yVel;
      this.x += dx;
      this.y += dy;
    }
  }
}
