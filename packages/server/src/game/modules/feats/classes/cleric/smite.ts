import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class SmiteFeat extends Feat {
  constructor(entity: Entity) {
    super("smite", entity);

    this.cooldown = 40;
  }

  effect() {
    const smiteWeapon: IWeapon = {
      _id: "smite",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT * 3,
      damageBonuses: [],
      damageType: "force",
      description: "",
      group: "misc",
      name: "smite",
      requiredLevel: 0,
      traits: [],
      crowdControlEffect: {
        duration: 5,
        level: 1,
        name: "stun",
      },
    };

    const width = 48;

    const x = this.entity.x + this.entity.deltaX;
    const y = this.entity.y + this.entity.deltaY;

    const getHitBoxRect = (): Rectangle => {
      return {
        x: x - width / 2,
        y: y - width / 2,
        width: width,
        height: width,
      };
    };

    const attack = new MeleeAttack(this.entity, smiteWeapon, getHitBoxRect);
    attack.execute();

    this.entity.world.broadcast("particle-spawn", {
      x: x,
      y: y,
      name: "holy_beam",
    });
  }
}
