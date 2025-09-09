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

    if (this.weapon.traits.includes("musical")) {
      for (let i = 0; i < 3; i++) {
        const delay = i * randomInt(10, 30);

        setTimeout(() => {
          const spreadAngle = randomInt(-5, 5);
          const angleRad = degToRad(spreadAngle);

          const vx = this.entity.x + randomInt(-10, 10);
          const vy = this.entity.y + randomInt(-10, 10);

          const noteIndex = randomInt(1, 5);

          new Projectile({
            x: vx,
            y: vy,
            z: 0,
            xVelocity: delta.x * (this.weapon.projectileSpeed ?? 0),
            yVelocity: delta.y * (this.weapon.projectileSpeed ?? 0),
            zVelocity: 0,
            lifespan: this.weapon.projectileRange ?? 0,
            world: this.entity.world,
            attack: this,
            name: `music_note_${noteIndex}`,
          });
        }, delay);
      }
      return;
    }

    if (!this.weapon.traits.includes("rigid")) {
      new Projectile({
        x: this.entity.x,
        y: this.entity.y,
        z: this.entity.z,
        xVelocity: delta.x * this.weapon.projectileSpeed,
        yVelocity: delta.y * this.weapon.projectileSpeed,
        zVelocity: 0,
        lifespan: this.weapon.projectileRange,
        world: this.entity.world,
        attack: this,
        name: this.weapon.projectile,
      });

      return;
    }

    const vx = delta.x * (this.weapon.projectileSpeed ?? 0);
    const vz = calculateLaunchSpeed({
      x0: this.entity.x,
      v0: vx * tickInterval,
      xf: this.entity.x + this.entity.deltaX,
    });

    new Projectile({
      x: this.entity.x,
      y: this.entity.y,
      z: 16,
      xVelocity: delta.x * (this.weapon.projectileSpeed ?? 0),
      yVelocity: delta.y * (this.weapon.projectileSpeed ?? 0),
      zVelocity: -vz,
      lifespan: this.weapon.projectileRange * 20,
      world: this.entity.world,
      attack: this,
      name: this.weapon.projectile,
    });
  }

  effect(entity: Entity, projectile?: Projectile): void {
    if (!projectile) return;

    this.performAttack(entity);
  }
}
