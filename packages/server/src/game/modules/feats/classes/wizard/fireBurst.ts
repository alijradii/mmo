import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class FireBurstFeat extends Feat {
  constructor(entity: Entity) {
    super("fire_burst", entity);

    this.cooldown = 30;
  }

  effect() {
    const lightningBoltWeapon: IWeapon = {
      _id: "fire_pillar",
      attackForce: 0,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT,
      damageBonuses: [],
      damageType: "fire",
      description: "",
      group: "misc",
      name: "fire_pillar",
      requiredLevel: 0,
      traits: [],
    };

    const width = 48;
    const radius = 48;
    const pillars = 12;

    for (let i = 0; i < pillars; i++) {
      const angle = (2 * Math.PI * i) / pillars;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      const getHitBoxRect = (): Rectangle => {
        return {
          x: this.entity.x + offsetX - width / 2,
          y: this.entity.y + offsetY - width / 2,
          width: width,
          height: width,
        };
      };

      const attack = new MeleeAttack(
        this.entity,
        lightningBoltWeapon,
        getHitBoxRect
      );
      attack.execute();

      this.entity.world.broadcast("particle-spawn", {
        x: this.entity.x + offsetX,
        y: this.entity.y + offsetY,
        name: "fire_pillar",
      });
    }
  }
}
