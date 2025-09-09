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

    const count : number = this.weapon.projectileCount || 1;

    for (let i = 0; i < count; i++) {
      const startX =
        count > 1 ? this.entity.x + randomInt(-10, 10) : this.entity.x;
      const startY =
        count > 1 ? this.entity.y + randomInt(-10, 10) : this.entity.y;

      const noteIndex = randomInt(1, 5);

      const name = this.weapon.traits.includes("musical")
        ? `music_note_${noteIndex}`
        : this.weapon.projectile;

      const vx = delta.x * (this.weapon.projectileSpeed ?? 0);
      const vz = this.weapon.traits.includes("rigid")
        ? calculateLaunchSpeed({
            x0: this.entity.x,
            v0: vx * tickInterval,
            xf: this.entity.x + this.entity.deltaX,
          })
        : 0;

      new Projectile({
        x: startX,
        y: startY,
        z: 10,
        xVelocity: delta.x * (this.weapon.projectileSpeed ?? 0),
        yVelocity: delta.y * (this.weapon.projectileSpeed ?? 0),
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
