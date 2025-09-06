import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class HammerOfJusticeFeat extends Feat {
  constructor(entity: Entity) {
    super("hammer_of_justice", entity);

    this.cooldown = 30;
  }

  effect() {
    const smiteWeapon: IWeapon = {
      _id: "hammer_of_justice",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT * 3,
      damageBonuses: [],
      damageType: "force",
      description: "",
      group: "axe",
      name: "hammer_of_justice",
      requiredLevel: 0,
      traits: [],
      crowdControlEffect: {
        duration: 5,
        level: 1,
        name: "stun",
      },
    };

    const width =  64;

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
      name: "paladin_justice_hammer",
    });

    this.entity.world.broadcast("circle-spawn", {
      x: this.entity.x,
      y: this.entity.y,
      xRadius: 10,
      yRadius: 10,
      color: 0xe7ff12,
      duration: 400,
    });
  }
}
