import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MobFactory } from "../../../../entities/mobs/mobFactory";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class SkeletonArise extends Feat {
  constructor(entity: Entity) {
    super("skeleton_arise", entity);

    this.cooldown = 400;
    this.isReady = false;
    this.cooldownEndTime = Date.now() + (30) * 1000;
    this.isReady = false;
  }

  effect() {
    const earthDamage: IWeapon = {
      _id: "earth_damage",
      attackForce: 0,
      attackSpeed: 0,
      damage: 10,
      damageBonuses: [],
      damageType: "bludgeoning",
      description: "",
      group: "misc",
      name: "earth damage",
      requiredLevel: 0,
      traits: [],
    };

    const width = 48;
    const radius = 100;
    const summons = 6;

    const heightmap = this.entity.world.mapInfo.heightmap;

    for (let i = 0; i < summons; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      if (
        heightmap[Math.floor((this.entity.y + offsetY) / 16)]?.[
          Math.floor((this.entity.x + offsetX) / 16)
        ] !== 1
      )
        continue;

      const spawnedUnit = MobFactory("SkeletonWarrior", this.entity.world);
      spawnedUnit.x = this.entity.x + offsetX;
      spawnedUnit.y = this.entity.y + offsetY;
      this.entity.world.spawn(spawnedUnit);

      const getHitBoxRect = (): Rectangle => {
        return {
          x: this.entity.x + offsetX - width / 2,
          y: this.entity.y + offsetY - width / 2,
          width: width,
          height: width,
        };
      };

      const attack = new MeleeAttack(this.entity, earthDamage, getHitBoxRect);
      attack.execute();

      this.entity.world.broadcast("particle-spawn", {
        x: this.entity.x + offsetX,
        y: this.entity.y + offsetY,
        name: "earth2",
      });
    }
  }
}
