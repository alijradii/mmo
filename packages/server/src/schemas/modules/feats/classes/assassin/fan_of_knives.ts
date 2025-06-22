import { IWeapon } from "../../../../../database/models/weapon.model";
import { Projectile } from "../../../../core/projectile";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { RangedAttack } from "../../../attackModule/rangedAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class FanOfKnivesFeat extends Feat {
  constructor(entity: Entity) {
    super("fan_of_knives", entity);

    this.cooldown = 30;
  }

  effect() {
    const shuriken: IWeapon = {
      _id: "shuriken",
      attackForce: 0,
      attackSpeed: 0,
      damage: this.entity.finalStats.DEX,
      damageBonuses: [],
      damageType: "piercing",
      description: "",
      group: "misc",
      name: "shuriken",
      requiredLevel: 0,
      traits: [],
    };

    const attack = new RangedAttack(this.entity, shuriken);

    const numProjectiles = 8;
    const speed = 500;

    for (let i = 0; i < numProjectiles; i++) {
      const angle = (2 * Math.PI * i) / numProjectiles;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      new Projectile({
        x: this.entity.x,
        y: this.entity.y,
        z: 0,
        xVelocity: dx * speed,
        yVelocity: dy * speed,
        zVelocity: 0,
        lifespan: 50,
        world: this.entity.world,
        attack: attack,
        name: "shuriken",
      });
    }
  }
}
