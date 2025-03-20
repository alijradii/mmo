import { Rectangle } from "../../utils/hitboxes";
import { GameObject } from "./gameObject";
import { GameRoom } from "../../rooms/gameRoom";
import {
  Vec2Dot,
  Vec2Limit,
  Vec2MultiplyByScalar,
  Vec2Sub,
} from "../../utils/math/vec2";
import { Vec3 } from "../../utils/math/vec3";
import { Player } from "../player/player";
import { PlayerJumpState } from "../player/states/playerJumpState";

const tickInterval = 20 / 1000;
const gravityAcceleration = 16;

export class RigidBody extends GameObject {
  groundHeight: number = 0;

  accelSpeed: number = 1;
  accelDir: Vec3 = { x: 0, y: 0, z: 0 };

  airFriction: number = 0.2;
  friction: number = 1;

  maxSpeed: number = 180;

  minSpeed: number = 0.2;

  colliderWidth: number = 0;

  colliderHeight: number = 0;

  world: GameRoom;

  constructor(room: GameRoom) {
    super();
    this.world = room;

    this.groundHeight = this.getGroundHeight();
  }

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
    return this.z <= 0 ? this.friction : 0.2;
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

    x = Math.max(x, 0);
    x = Math.min(x, this.world.mapInfo.width - 1);

    y = Math.max(y, 0);
    y = Math.min(y, this.world.mapInfo.height - 1);

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
      y: this.y + dy + this.height / 2,
    });

    let tileX = Math.floor(dest.x / 16);
    let tileY = Math.floor(dest.y / 16);

    const tileHeight = this.world.mapInfo.heightmap[tileY][tileX];
    const tileHeightPixels = tileHeight * 16;

    if (this.groundHeight < 0) {
      this.groundHeight = 0;
      this.z = 0;
    }

    // same height: update x y then z
    // walls ?
    // different height

    // same height
    if (tileHeightPixels === this.groundHeight) {
      this.x += dx;
      this.y += dy;

      this.clampPosition();
      this.updateGravity();
      return;
    }

    // going up a slope
    if (
      this.z <= 0 &&
      this.groundHeight < tileHeightPixels &&
      this.groundHeight + 16 >= tileHeightPixels
    ) {
      if (this instanceof Player && this.state !== "jump") {
        this.setState(new PlayerJumpState(this));
      }
      this.updateGravity();
      return;
    }

    // going down a slope
    if (this.groundHeight > tileHeightPixels && tileHeightPixels > 0) {
      if (this instanceof Player && this.state !== "jump") {
        this.setState(new PlayerJumpState(this));
      }
      this.y += dy;
      this.x += dx;

      const delta = this.groundHeight - tileHeightPixels;
      if (delta < 0) throw new Error("delta down a slop is negative");
      this.z += delta;
      this.y += delta;

      this.groundHeight = tileHeightPixels;
      this.updateGravity();
      return;
    }

    // jumping over a higher slope
    if (
      this.z > 0 &&
      this.groundHeight < tileHeightPixels &&
      this.groundHeight + this.z + 10 >= tileHeightPixels
    ) {
      this.x += dx;
      this.y += dy;

      let delta = this.groundHeight + this.z - tileHeightPixels;
      if (delta < 0) {
        delta += 10;
      }

      this.groundHeight = tileHeightPixels;
      this.z -= delta;
      this.y -= delta;
      this.updateGravity();
      return;
    }

    if (tileHeightPixels < 0) {
      let i = tileY;
      let j = tileX;

      while (this.world.mapInfo.heightmap[i][j] < 0) {
        i--;
      }

      let wallHeightPixels = this.world.mapInfo.heightmap[i][j] * 16;
      console.log(
        this.z + this.groundHeight + 10,
        "compared to",
        wallHeightPixels,
        this.z
      );

      if (this.z <= 0 || this.z + this.groundHeight + 10 < wallHeightPixels) {
        // failed to climb wall -> fall down
        i = tileY;

        if (dy < 0) {
          this.yVelocity = 0;
          this.accelDir.y = 0;
        }

        if (this.z <= 0 && this instanceof Player && this.state !== "jump") {
          this.setState(new PlayerJumpState(this));
        }

        while (this.world.mapInfo.heightmap[i][j] < 0) {
          i++;
        }

        const delta = i * 16 - this.y;
        this.y += delta;
        this.z += delta;
        this.groundHeight = this.world.mapInfo.heightmap[i][j] * 16;
      } else {
        this.x += dx;
        this.y += dy;
      }

      this.updateGravity();
      return;
    }

    if (this.z > 0) {
      this.updateGravity();
      return;
    }

    this.resolveBlockedMovement(dx, dy);

    // this.groundHeight = tileHeightPixels;

    // // If tileHeight is negative, we hit a wall → prevent movement
    // if (tileHeight < 0) {
    //   if (this.grounded) {
    //     if (!this.resolveBlockedMovement(dx, dy)) {
    //       this.y += 300 * tickInterval;
    //     }
    //   } else if (dy > 0) {
    //     this.y += dy;
    //     // this.z += dy;
    //   } else {
    //     this.y += this.zVelocity * tickInterval;
    //     this.z += this.zVelocity * tickInterval;
    //   }
    //   return;
    // }

    // // Normal movement: tile height matches ground
    // else if (this.groundHeight === tileHeightPixels) {
    //   this.x += dx;
    //   this.y += dy;
    // }
    // // Moving to a slightly different height → step up
    // else if (
    //   (this.grounded && this.groundHeight + 16 >= tileHeightPixels) ||
    //   (!this.grounded && this.groundHeight + this.z >= tileHeightPixels)
    // ) {
    //   if (this instanceof Player && this.state !== "jump" && this.grounded) {
    //     this.setState(new PlayerJumpState(this));
    //   }
    //   this.x += dx;
    //   this.y += dy;
    //   this.groundHeight = tileHeightPixels;
    // }
    // // Blocked -> attempt to resolve movement
    // else {
    //   this.resolveBlockedMovement(dx, dy);
    // }
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

        const newTileX = Math.floor((newX + 8) / 16);
        const newTileY = Math.floor((newY + 8) / 16);
        const newHeight =
          this.world.mapInfo.heightmap[newTileY]?.[newTileX] ?? -1;
        const newHeightPixels = newHeight * 16;

        if (newHeightPixels === this.groundHeight && newHeight > 0) {
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
