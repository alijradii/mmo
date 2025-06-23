import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class LightningStormFeat extends Feat {
  constructor(entity: Entity) {
    super("lightning_storm", entity);

    this.cooldown = 30;
  }

  effect() {
    const lightningBoltWeapon: IWeapon = {
      _id: "lightning_bolt",
      attackForce: 0,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT,
      damageBonuses: [],
      damageType: "electric",
      description: "",
      group: "misc",
      name: "lightning_bolt",
      requiredLevel: 0,
      traits: [],
    };

    const width = 48;
    const minRadius = 32;
    const maxRadius = 96;
    const bolts = 12;

    for (let i = 0; i < bolts; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
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
        name: "lightning_bolt",
      });
    }
  }
}
