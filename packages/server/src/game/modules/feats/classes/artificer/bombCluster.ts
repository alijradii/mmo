import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Projectile } from "../../../../core/projectile";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class BombClusterFeat extends Feat {
  constructor(entity: Entity) {
    super("bomb_cluster", entity);

    this.cooldown = 30;
  }

  effect() {
    const bombClusterWeapon: IWeapon = {
      _id: "bomb_cluster",
      attackForce: 0,
      attackSpeed: 0,
      damage: 20,
      damageBonuses: [],
      damageType: "bludgeoning",
      description: "",
      group: "misc",
      name: "bomb_cluster",
      requiredLevel: 0,
      traits: ["rigid"],

      projectile: "bullet",
      projectileCount: 5,
      projectileRange: 300,
      projectileSpeed: 300,
      callback: "explosion",
      projectileSpread: 14,
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
