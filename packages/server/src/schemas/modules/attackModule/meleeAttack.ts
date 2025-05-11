import { IWeapon } from "../../../database/models/weapon.model";
import { Rectangle } from "../../../utils/hitboxes";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

export class MeleeAttack extends Attack {
  constructor(entity: Entity, weapon?: IWeapon) {
    super(entity, weapon);
  }

  execute(): void {
    super.execute();

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
