import { Vec2Normalize } from "../../../utils/math/vec2";
import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

export class RangedAttack extends Attack {
  public speed = 300;

  super(entity: Entity) {
    this.entity = entity;
    this.attackType = "ranged";
  }

  execute(tick: number): void {
    super.execute(tick);

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });
    if(delta.x === 0 && delta.y === 0)
      
      console.log(delta.x * this.speed, delta.y * this.speed)

    new Projectile({
      x: this.entity.x,
      y: this.entity.y,
      z: this.entity.z,
      xVelocity: delta.x * this.speed,
      yVelocity: delta.y * this.speed,
      zVelocity: 0,
      lifespan: 200,
      world: this.entity.world,
    });
  }
}
