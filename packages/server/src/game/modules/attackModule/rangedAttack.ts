import { IWeapon } from "../../../database/models/weapon.model";
import { degToRad, randomInt } from "../../../utils/math/helpers";
import { Vec2Normalize } from "../../../utils/math/vec2";
import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";
import { calculateLaunchSpeed } from "./projectileUtils";

const tickInterval = 1 / 50;

export class RangedAttack extends Attack {
  constructor(entity: Entity, weapon: IWeapon) {
    super(entity, weapon);
    this.attackType = "ranged";
  }

  execute(): void {
    super.execute();

    if (
      !this.weapon ||
      !this.weapon.projectile ||
      this.weapon.projectileSpeed === undefined ||
      this.weapon.projectileSpeed === null ||
      this.weapon.projectileRange === undefined ||
      this.weapon.projectileRange === null
    )
      throw new Error(`Invalid ranged weapon:  ${this.weapon?.name}`);

    const isZeroSpeed = this.weapon.projectileSpeed === 0;
    
    // For zero-speed projectiles (mines/bombs), we don't need a direction
    // For regular projectiles, we need a direction
    if (!isZeroSpeed) {
      const delta = Vec2Normalize({
        x: this.entity.deltaX,
        y: this.entity.deltaY,
      });

      if (delta.x === 0 && delta.y === 0) return;
    }

    const count: number = this.weapon.projectileCount || 1;
    const spread = this.weapon.projectileSpread || 0; // in degrees

    for (let i = 0; i < count; i++) {
      const startX =
        count > 1 ? this.entity.x + randomInt(-10, 10) : this.entity.x;
      const startY =
        count > 1 ? this.entity.y + randomInt(-10, 10) : this.entity.y;

      let vx = 0;
      let vy = 0;
      let vz = 0;

      if (isZeroSpeed) {
        // Zero-speed projectiles don't move, they just sit and countdown
        vx = 0;
        vy = 0;
        vz = 0;
      } else {
        const delta = Vec2Normalize({
          x: this.entity.deltaX,
          y: this.entity.deltaY,
        });

        const angleOffset = degToRad(Math.random() * spread - spread / 2);

        const cos = Math.cos(angleOffset);
        const sin = Math.sin(angleOffset);

        const spreadX = delta.x * cos - delta.y * sin;
        const spreadY = delta.x * sin + delta.y * cos;

        vx = spreadX * this.weapon.projectileSpeed;
        vy = spreadY * this.weapon.projectileSpeed;

        vz = this.weapon.traits.includes("rigid")
          ? calculateLaunchSpeed({
              x0: this.entity.x,
              v0: vx * tickInterval,
              xf: this.entity.x + this.entity.deltaX,
            })
          : 0;

        vz = Math.max(vz, -this.weapon.projectileRange);
      }

      const noteIndex = randomInt(1, 5);
      const name = this.weapon.traits.includes("musical")
        ? `music_note_${noteIndex}`
        : this.weapon.projectile;

      // For zero-speed projectiles, range acts as countdown timer (lifespan)
      // For regular projectiles, range is the distance/lifespan
      const lifespan = this.weapon.projectileRange;

      // If homing, invert initial velocity so projectiles curve back toward enemies
      const isHoming = this.weapon.traits.includes("homing");
      const finalVx = isHoming ? vx * -1 : vx;
      const finalVy = isHoming ? vy * -1 : vy;

      new Projectile({
        x: startX,
        y: startY,
        z: isZeroSpeed ? 0 : 10, // Zero-speed projectiles sit on the ground
        xVelocity: finalVx,
        yVelocity: finalVy,
        zVelocity: -vz,
        lifespan: lifespan,
        world: this.entity.world,
        attack: this,
        name,
      });
    }
  }

  effect(entity: Entity, projectile?: Projectile): void {
    if (!projectile) return;
    this.performAttack(entity);
  }
}
