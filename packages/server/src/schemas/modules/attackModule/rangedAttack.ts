import {
  getDirectionFromVector,
  Vec2Normalize,
} from "../../../utils/math/vec2";
import { Projectile } from "../../core/projectile";
import { Entity } from "../../entities/entity";
import { StunnedState } from "../../entities/genericStates/stunnedState";
import { Attack } from "./attack";

export class RangedAttack extends Attack {
  constructor(entity: Entity) {
    super(entity);
    this.entity = entity;
    this.attackType = "ranged";
  }

  execute(tick: number): void {
    super.execute(tick);

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });
    if (delta.x === 0 && delta.y === 0) return;

    new Projectile({
      x: this.entity.x,
      y: this.entity.y,
      z: this.entity.z,
      xVelocity: delta.x * this.speed,
      yVelocity: delta.y * this.speed,
      zVelocity: 0,
      lifespan: this.range,
      world: this.entity.world,
      attack: this,
    });
  }

  effect(entity: Entity, projectile?: Projectile): void {
    if (!projectile) return;

    entity.HP -= this.damage;

    entity.setState(new StunnedState(entity, 1));

    const dx = this.entity.x - entity.x;
    const dy = this.entity.y - entity.y;

    const normalizedVec = {
      x: projectile.xVelocity / this.speed,
      y: projectile.yVelocity / this.speed,
    };
    const knockbackPower = this.knockback;
    entity.xVelocity = normalizedVec.x * knockbackPower;
    entity.yVelocity = normalizedVec.y * knockbackPower;

    const dir = getDirectionFromVector({ x: dx, y: dy });
    entity.direction = dir;

    if (entity.HP <= 0) entity.kill();
  }
}
