import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

export class RangedAttack extends Attack {
  super(entity: Entity) {
    this.entity = entity;
  }

  execute(tick: number): void {
    new Projectile({
      x: this.entity.x,
      y: this.entity.y,
      z: this.entity.z,
      xVelocity: 0,
      yVelocity: 0,
      zVelocity: 0,
      lifespan: 20,
      world: this.entity.world,
    });
  }
}
