import { IWeapon } from "../../../database/models/weapon.model";
import { Rectangle } from "../../../utils/hitboxes";
import { Entity } from "../../entities/entity";
import { Attack } from "./attack";

export class MeleeAttack extends Attack {
  private getHitBoxRect?: () => Rectangle;

  constructor(
    entity: Entity,
    weapon: IWeapon,
    getHitBoxRect?: () => Rectangle
  ) {
    super(entity, weapon);
    this.getHitBoxRect = getHitBoxRect;
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
    if(this.getHitBoxRect) {
      return this.getHitBoxRect();
    }

    return this.entity.getHitBoxRect();
  }
}
