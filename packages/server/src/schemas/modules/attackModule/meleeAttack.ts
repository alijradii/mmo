import { Rectangle } from "../../../utils/hitboxes";
import {
  getDirectionFromVector,
  Vec2Normalize,
} from "../../../utils/math/vec2";
import { Entity } from "../../entities/entity";
import { StunnedState } from "../../entities/genericStates/stunnedState";
import { Attack } from "./attack";

export class MeleeAttack extends Attack {
  constructor(entity: Entity) {
    super(entity);

    this.damage = 10;
  }

  execute(tick: number): void {
    super.execute(tick);

    this.entity.world.executeCallbackRect(
      this.getHitBox(),
      this.effect,
      this.filter
    );
  }

  effect(entity: Entity): void {
    entity.HP -= this.damage;
    entity.setState(new StunnedState(entity, 15));

    const dx = this.entity.x - entity.x;
    const dy = this.entity.y - entity.y;

    const normalizedVec = Vec2Normalize({ x: -dx, y: -dy });
    const knockbackPower = 300;
    entity.xVelocity = normalizedVec.x * knockbackPower;
    entity.yVelocity = normalizedVec.y * knockbackPower;

    const dir = getDirectionFromVector({ x: dx, y: dy });
    entity.direction = dir;

    if (entity.HP < 0) entity.kill();
  }

  getHitBox(): Rectangle {
    return this.entity.getHitBoxRect();
  }
}
