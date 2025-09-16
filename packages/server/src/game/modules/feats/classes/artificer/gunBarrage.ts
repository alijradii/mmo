import { IWeapon } from "../../../../../database/models/weapon.model";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class GunBarrageFeat extends Feat {
  constructor(entity: Entity) {
    super("bomb_cluster", entity);

    this.cooldown = 30;
  }

  effect() {
    const gunBarrageWeapon: IWeapon = {
      _id: "gun_barrage",
      attackForce: 0,
      attackSpeed: 100,
      damage: 5,
      damageBonuses: [],
      damageType: "piercing",
      description: "",
      group: "misc",
      name: "gun_barrage",
      requiredLevel: 0,
      traits: [],

      projectile: "bullet",
      projectileCount: 20,
      projectileRange: 20,
      projectileSpeed: 300,
      projectileSpread: 180,

      callback: "smoke",
    };

    const gunBarrageAttack: RangedAttack = new RangedAttack(
      this.entity,
      gunBarrageWeapon
    );

    gunBarrageAttack.execute();
  }
}
