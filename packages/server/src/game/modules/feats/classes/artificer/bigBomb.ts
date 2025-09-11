import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class BigBombFeat extends Feat {
  constructor(entity: Entity) {
    super("big_bomb", entity);

    this.cooldown = 30;
  }

  effect() {
    const bombClusterWeapon: IWeapon = {
      _id: "big_bomb",
      attackForce: 300,
      attackSpeed: 0,
      damage: 20,
      damageBonuses: [],
      damageType: "bludgeoning",
      description: "",
      group: "misc",
      name: "big_bomb",
      requiredLevel: 0,
      traits: ["rigid"],

      projectile: "sphere_bomb",
      projectileCount: 6,
      projectileRange: 300,
      projectileSpeed: 300,
      callback: "explosion",
      projectileSpread: 50,
    };

    const bombClusterAttack: RangedAttack = new RangedAttack(
      this.entity,
      bombClusterWeapon
    );

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    if (delta.x === 0 && delta.y === 0) return;

    bombClusterAttack.execute();
  }
}
