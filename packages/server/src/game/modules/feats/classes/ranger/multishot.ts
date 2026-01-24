import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class MultishotFeat extends Feat {
  constructor(entity: Entity) {
    super("multishot", entity);

    this.cooldown = 20;
  }

  effect() {
    const multishotWeapon: IWeapon = {
      _id: "multishot",
      attackForce: 100,
      attackSpeed: 0,
      damage: 25,
      damageBonuses: [],
      damageType: "piercing",
      description: "",
      group: "misc",
      name: "multishot",
      requiredLevel: 0,
      traits: [],

      projectile: "arrow",
      projectileCount: 8,
      projectileRange: 50,
      projectileSpeed: 450,
      projectileSpread: 45,
    };

    const multishotAttack: RangedAttack = new RangedAttack(
      this.entity,
      multishotWeapon
    );

    multishotAttack.execute();
  }
}

