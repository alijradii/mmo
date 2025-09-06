import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class HallowedGroundFeat extends Feat {
  constructor(entity: Entity) {
    super("hallowed_ground", entity);

    this.cooldown = 40;
  }

  effect() {
    const smiteWeapon: IWeapon = {
      _id: "hallowed_ground",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.INT * 3,
      damageBonuses: [],
      damageType: "force",
      description: "",
      group: "misc",
      name: "hallowed_ground",
      requiredLevel: 0,
      traits: [],
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
      name: "paladin_explosion",
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
