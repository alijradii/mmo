import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class EarthBreakFeat extends Feat {
  constructor(entity: Entity) {
    super("earth_break", entity);

    this.cooldown = 30;
  }

  effect() {
    const earthBreak: IWeapon = {
      _id: "earth_break",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.STR * 3,
      damageBonuses: [],
      damageType: "bludgeoning",
      description: "",
      group: "axe",
      name: "earth_break",
      requiredLevel: 0,
      traits: [],
      statusEffects: [{name: "immobilized", duration: 10_000, level: 1}]
    };

    const width = 48;
    const getHitBoxRect = (): Rectangle => {
      return {
        x: this.entity.x - width / 2,
        y: this.entity.y - width / 2,
        width: width,
        height: width,
      };
    };

    const attack = new MeleeAttack(
      this.entity,
      earthBreak,
      getHitBoxRect
    );
    attack.execute();
    // this.entity.setState(new AttackState(this.entity, attack));

    this.entity.world.broadcast("particle-spawn", {
      x: this.entity.x,
      y: this.entity.y,
      name: "earth_fall_break",
    });
  }
}
