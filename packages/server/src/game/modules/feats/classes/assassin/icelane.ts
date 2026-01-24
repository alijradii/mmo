import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class IcelaneFeat extends Feat {
  constructor(entity: Entity) {
    super("icelane", entity);

    this.cooldown = 20;
  }

  effect() {
    const projectileCount = 5;
    const delayBetweenShots = 100; // milliseconds between each projectile
    const spread = 20; // degrees
    const speed = 400;
    const range = 60;
    const damage = this.entity.finalStats.DEX * 1.2;

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    if (delta.x === 0 && delta.y === 0) return;

    // Fire projectiles in succession
    for (let i = 0; i < projectileCount; i++) {
      setTimeout(() => {
        const icelaneWeapon: IWeapon = {
          _id: "icelane",
          attackForce: 100,
          attackSpeed: 0,
          damage: damage,
          damageBonuses: [],
          damageType: "piercing",
          description: "",
          group: "misc",
          name: "icelane",
          requiredLevel: 0,
          traits: ["piercing"], // Piercing allows projectiles to go through enemies

          projectile: "arrow_of_light",
          projectileCount: 1, // Fire one at a time
          projectileRange: range,
          projectileSpeed: speed,
          projectileSpread: spread,
        };

        const icelaneAttack: RangedAttack = new RangedAttack(
          this.entity,
          icelaneWeapon
        );

        icelaneAttack.execute();
      }, i * delayBetweenShots);
    }
  }
}

