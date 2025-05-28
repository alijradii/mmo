import { IWeapon } from "../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../utils/math/vec2";
import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

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
    console.log("attacking: ", delta.x, delta.y);
    if (delta.x === 0 && delta.y === 0) return;

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
  }

  effect(entity: Entity, projectile?: Projectile): void {
    if (!projectile) return;

    this.performAttack(entity);
  }
}
