import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class AssassinateFeat extends Feat {
  constructor(entity: Entity) {
    super("assassinate", entity);

    this.cooldown = 30;
  }

  effect() {
    const assassinateWeapon: IWeapon = {
      _id: "assassinate",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.DEX * 3,
      damageBonuses: [],
      damageType: "slashing",
      description: "",
      group: "sword",
      name: "assassinate",
      requiredLevel: 0,
      traits: [],
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
      assassinateWeapon,
      getHitBoxRect
    );
    attack.execute();
    // this.entity.setState(new AttackState(this.entity, attack));

    this.entity.world.broadcast("particle-spawn", {
      x: this.entity.x,
      y: this.entity.y,
      name: "impact",
    });
  }
}
