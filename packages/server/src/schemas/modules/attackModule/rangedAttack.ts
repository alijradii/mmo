import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

export class RangedAttack extends Attack {
  super(entity: Entity) {
    this.entity = entity;
    this.attackType = "ranged"
  }

  execute(tick: number): void {
    new Projectile({
      x: this.entity.x,
      y: this.entity.y,
      z: this.entity.z,
      xVelocity: 400,
      yVelocity: 0,
      zVelocity: 0,
      lifespan: 200,
      world: this.entity.world,
    });
  }
}
