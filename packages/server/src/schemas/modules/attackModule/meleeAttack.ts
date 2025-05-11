import { WeaponStatBlock } from "../../../data/dataStore";
import { IWeapon } from "../../../database/models/weapon.model";
import { Rectangle } from "../../../utils/hitboxes";
import {
  getDirectionFromVector,
  Vec2Normalize,
} from "../../../utils/math/vec2";
import { Entity } from "../../entities/entity";
import { StunnedState } from "../../entities/genericStates/stunnedState";
import { Attack } from "./attack";

export class MeleeAttack extends Attack {
  constructor(entity: Entity, weapon?: IWeapon) {
    super(entity, weapon);
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
    this.performAttack(entity);
  }

  getHitBox(): Rectangle {
    return this.entity.getHitBoxRect();
  }
}
