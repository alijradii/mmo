import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class ExplosiveArrowFeat extends Feat {
  constructor(entity: Entity) {
    super("explosive_arrow", entity);

    this.cooldown = 15;
  }

  effect() {
    const explosiveArrowWeapon: IWeapon = {
      _id: "explosive_arrow",
      attackForce: 200,
      attackSpeed: 0,
      damage: 40,
      damageBonuses: [],
      damageType: "piercing",
      description: "",
      group: "misc",
      name: "explosive_arrow",
      requiredLevel: 0,
      traits: [],

      projectile: "bullet",
      projectileCount: 1,
      projectileRange: 60,
      projectileSpeed: 500,
      callback: "small_explosion",
    };

    const explosiveArrowAttack: RangedAttack = new RangedAttack(
      this.entity,
      explosiveArrowWeapon
    );

    explosiveArrowAttack.execute();
  }
}

