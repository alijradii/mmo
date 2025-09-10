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
      !this.weapon.projectileSpeed ||
      !this.weapon.projectileRange
    )
      throw new Error(`Invalid ranged weapon:  ${this.weapon?.name}`);

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    if (delta.x === 0 && delta.y === 0) return;

    const count: number = this.weapon.projectileCount || 1;
    const spread = this.weapon.projectileSpread || 0; // in degrees

    for (let i = 0; i < count; i++) {
      const startX =
        count > 1 ? this.entity.x + randomInt(-10, 10) : this.entity.x;
      const startY =
        count > 1 ? this.entity.y + randomInt(-10, 10) : this.entity.y;

      const angleOffset = degToRad(
        (Math.random() * spread) - spread / 2
      );

      const cos = Math.cos(angleOffset);
      const sin = Math.sin(angleOffset);

      const spreadX = delta.x * cos - delta.y * sin;
      const spreadY = delta.x * sin + delta.y * cos;

      const vx = spreadX * (this.weapon.projectileSpeed ?? 0);
      const vy = spreadY * (this.weapon.projectileSpeed ?? 0);

      const vz = this.weapon.traits.includes("rigid")
        ? calculateLaunchSpeed({
            x0: this.entity.x,
            v0: vx * tickInterval,
            xf: this.entity.x + this.entity.deltaX,
          })
        : 0;

      const noteIndex = randomInt(1, 5);
      const name = this.weapon.traits.includes("musical")
        ? `music_note_${noteIndex}`
        : this.weapon.projectile;

      new Projectile({
        x: startX,
        y: startY,
        z: 10,
        xVelocity: vx,
        yVelocity: vy,
        zVelocity: -vz,
        lifespan: this.weapon.projectileRange ?? 0,
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
