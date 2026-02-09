import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";

@entity
export class IceBurstFeat extends Feat {
  constructor(entity: Entity) {
    super("ice_burst", entity);

    this.cooldown = 0;
  }

  effect() {
    const iceShardWeapon: IWeapon = {
      _id: "ice_shard",
      attackForce: 200,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT,
      damageBonuses: [],
      damageType: "cold",
      description: "",
      group: "misc",
      name: "ice_shard",
      requiredLevel: 0,
      traits: [],
      statusEffects: [
        { name: "chilled", duration: 4_000, level: 1 },
      ],
    };

    const width = 64;
    const particleCount = 6;
    const delayBetweenParticles = 400;
    const maxOffset = 30;

    const centerX = this.entity.x + this.entity.deltaX;
    const centerY = this.entity.y + this.entity.deltaY;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const offsetX = (Math.random() * 2 - 1) * maxOffset;
        const offsetY = (Math.random() * 2 - 1) * maxOffset;
        const x = centerX + offsetX;
        const y = centerY + offsetY;

        const getHitBoxRect = (): Rectangle => {
          return {
            x: x - width / 2,
            y: y - width / 2,
            width: width,
            height: width,
          };
        };

        const attack = new MeleeAttack(
          this.entity,
          iceShardWeapon,
          getHitBoxRect
        );
        attack.execute();

        this.entity.world.broadcast("particle-spawn", {
          x,
          y,
          name: "ice_break",
        });
      }, i * delayBetweenParticles);
    }
  }
}
