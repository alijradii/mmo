import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class CaltropsFeat extends Feat {
  constructor(entity: Entity) {
    super("caltrops", entity);

    this.cooldown = 15;
  }

  effect() {
    const caltropsWeapon: IWeapon = {
      _id: "caltrops",
      attackForce: 50,
      attackSpeed: 0,
      damage: this.entity.finalStats.DEX * 0.8,
      damageBonuses: [],
      damageType: "piercing",
      description: "",
      group: "misc",
      name: "caltrops",
      requiredLevel: 0,
      traits: ["piercing"], // Piercing tag as requested

      projectile: "bullet",
      projectileCount: 4,
      projectileRange: 200, // Countdown timer (200 ticks = 4 seconds at 50 ticks/sec)
      projectileSpeed: 0, // Zero speed - caltrops sit on the ground
    };

    const caltropsAttack: RangedAttack = new RangedAttack(
      this.entity,
      caltropsWeapon
    );

    // Zero-speed projectiles don't need direction, so we can execute directly
    caltropsAttack.execute();
  }
}

