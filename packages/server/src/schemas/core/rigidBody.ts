import { Rectangle } from "../../utils/hitboxes";
import { GameObject } from "./gameObject";
import { GameRoom } from "../../rooms/gameRoom";
import {
  Vec2,
  Vec2Dot,
  Vec2Limit,
  Vec2MultiplyByScalar,
  Vec2Sub,
} from "../../utils/math/vec2";
import { Vec3 } from "../../utils/math/vec3";
import { Entity } from "../entities/entity";
import { NPC } from "../entities/npcs/npc";

const tickInterval = 20 / 1000;
const gravityAcceleration = 16;

export class RigidBody extends GameObject {
  npc: boolean = false;
  accelSpeed: number = 1;
  accelDir: Vec3 = { x: 0, y: 0, z: 0 };

  airFriction: number = 0.2;
  friction: number = 1;

  maxSpeed: number = 180;

  minSpeed: number = 0.2;

  colliderWidth: number = 0;

  colliderHeight: number = 0;

  world: GameRoom;

  lastValidPosition: Vec2 = { x: 0, y: 0 };

  constructor(room: GameRoom) {
    super();
    this.world = room;
  }

  kill() {}

  getGroundHeight(): number {
    let { x, y } = this.clampPosition({ x: this.x, y: this.y });

    let tileX = Math.floor((x + this.width / 2) / 16);
    let tileY = Math.floor((y + this.height / 2) / 16);

    const tileHeight = this.world.mapInfo.heightmap[tileY][tileX] * 16;

    return tileHeight === -16 ? 0 : tileHeight;
  }

  getMaxSpeed(): number {
    return this.maxSpeed;
  }

  getFriction(): number {
    return this.z > 0 || this.zVelocity > 0 ? 0.2 : this.friction;
  }

  getColliderRect(): Rectangle {
    return {
      x: this.x - this.colliderWidth / 2,
      y: this.y - this.colliderHeight / 2,
      width: this.colliderWidth,
      height: this.colliderHeight,
    };
  }

  validatePosition(position: { x: number; y: number }): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.world.mapInfo.width &&
      position.y < this.world.mapInfo.height
    );
  }

  clampPosition(position?: { x?: number; y?: number }) {
    let x = position?.x ?? this.x;
    let y = position?.y ?? this.y;

    x = Math.max(x, this.width);
    x = Math.min(x, this.world.mapInfo.width - 1 - this.width);

    y = Math.max(y, this.height);
    y = Math.min(y, this.world.mapInfo.height - 1 - this.height);

    if (!position) {
      this.x = x;
      this.y = y;
    }

    return { x, y };
  }

  updatePhysics() {
    let friction = this.getFriction();

    let accelVec = Vec2MultiplyByScalar(
      this.getMaxSpeed() * 10 * friction * this.accelSpeed * tickInterval,
      { x: this.accelDir.x, y: this.accelDir.y }
    );

    let frictionVec = Vec2MultiplyByScalar(friction * 12 * tickInterval, {
      x: this.xVelocity,
      y: this.yVelocity,
    });

    let velLength = Math.sqrt(this.xVelocity ** 2 + this.yVelocity ** 2);
    if (velLength <= this.getMaxSpeed()) {
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

    const limitedSpeedVec = Vec2Limit({ x: xVel, y: yVel }, this.getMaxSpeed());
    xVel = limitedSpeedVec.x;
    yVel = limitedSpeedVec.y;

    xVel -= frictionVec.x;
    yVel -= frictionVec.y;

    const dx = xVel * tickInterval;
    const dy = yVel * tickInterval;

    if (Math.abs(xVel) < 2) xVel = 0;
    if (Math.abs(yVel) < 2) yVel = 0;

    this.xVelocity = xVel;
    this.yVelocity = yVel;

    let dest = this.clampPosition({
      x: this.x + dx,
      y: this.y + dy,
    });

    let tileX = Math.floor(dest.x / 16);
    let tileY = Math.floor(dest.y / 16);

    let curX = Math.floor(this.x / 16);
    let curY = Math.floor(this.y / 16);

    const currentHeight = this.world.mapInfo.heightmap[curY][curX];
    const tileHeight = this.world.mapInfo.heightmap[tileY][tileX];

    // same height
    if (tileHeight === 1) {
      this.x += dx;
      this.y += dy;

      this.clampPosition();
      this.updateGravity();

      return;
    }

    // walls
    if ((tileHeight === 0 && this.npc) || tileHeight === -1) {
      this.resolveBlockedMovement(dx, dy);

      this.updateGravity();
      this.clampPosition();

      return;
    }

    // water
    if (tileHeight === 0) {
      if (currentHeight === 1 && this.z === 0) {
        if (this instanceof Entity) this.jump();
      } else if (this.z <= 0) {
        this.kill();
        return;
      }

      this.x += dx;
      this.y += dy;

      this.clampPosition();
      this.updateGravity();

      return;
    }

  }

  updateGravity() {
    if (this.z > 0 || this.zVelocity !== 0) {
      const terminalVelocity = -300;

      this.zVelocity = Math.max(
        this.zVelocity - gravityAcceleration,
        terminalVelocity
      );

      this.z += this.zVelocity * tickInterval;
    }

    if (this.z <= 0) {
      this.z = 0;
      this.zVelocity = 0;
    }
  }

  resolveBlockedMovement(dx: number, dy: number): boolean {
    for (let px = -1; px <= 1; px++) {
      for (let py = -1; py <= 1; py++) {
        if (px === 0 && py === 0) continue;

        // Only check movement in the intended direction
        if (px * dx < 0 || py * dy < 0) continue;

        const newX = this.x + px * 16;
        const newY = this.y + py * 16;

        if (!this.validatePosition({ x: newX, y: newY })) continue;

        const newTileX = Math.floor(newX / 16);
        const newTileY = Math.floor(newY / 16);
        const newHeight =
          this.world.mapInfo.heightmap[newTileY]?.[newTileX] ?? -1;

        if (newHeight === 1) {
          let newDX =
            Math.sign(dx) * Math.min(Math.abs(dx), Math.abs(newX - this.x));
          let newDY =
            Math.sign(dy) * Math.min(Math.abs(dy), Math.abs(newY - this.y));

          this.x += newDX;
          this.y += newDY;

          return true;
        }
      }
    }
    return false;
  }
}
