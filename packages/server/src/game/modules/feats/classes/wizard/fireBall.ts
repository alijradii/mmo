import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Vec2Normalize } from "../../../../../utils/math/vec2";
import { Projectile } from "../../../../core/projectile";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";

@entity
export class FireBallFeat extends Feat {
  constructor(entity: Entity) {
    super("fire_ball", entity);

    this.cooldown = 30;
  }

  effect() {
    const fireballWeapon: IWeapon = {
      _id: "fire_ball",
      attackForce: 0,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT * 4,
      damageBonuses: [],
      damageType: "fire",
      description: "",
      group: "misc",
      name: "fire_ball",
      requiredLevel: 0,
      traits: ["piercing"],
    };

    const fireballAttack: RangedAttack = new RangedAttack(this.entity, fireballWeapon);

    const speed = 340;

    const delta = Vec2Normalize({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    if (delta.x === 0 && delta.y === 0) return;

    if (this.entity instanceof Player) {
      new Projectile({
        x: this.entity.x,
        y: this.entity.y,
        z: 0,
        xVelocity: delta.x * speed,
        yVelocity: delta.y * speed,
        zVelocity: 0,
        lifespan: 70,
        world: this.entity.world,
        attack: fireballAttack,
        name: "fireball",
      });
    }
  }
}
