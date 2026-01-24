import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class PlaceBombFeat extends Feat {
  constructor(entity: Entity) {
    super("place_bomb", entity);

    this.cooldown = 20;
  }

  effect() {
    const placeBombWeapon: IWeapon = {
      _id: "place_bomb",
      attackForce: 600,
      attackSpeed: 0,
      damage: 100,
      damageBonuses: [],
      damageType: "bludgeoning",
      description: "",
      group: "misc",
      name: "place_bomb",
      requiredLevel: 0,
      traits: [],

      projectile: "sphere_bomb",
      projectileCount: 1,
      projectileRange: 150,
      projectileSpeed: 0,
      callback: "explosion",
    };

    const placeBombAttack: RangedAttack = new RangedAttack(
      this.entity,
      placeBombWeapon
    );

    // Zero-speed projectiles don't need direction, so we can execute directly
    placeBombAttack.execute();
  }
}

