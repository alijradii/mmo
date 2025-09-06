import { IWeapon } from "../../../../../database/models/weapon.model";
import { Rectangle } from "../../../../../utils/hitboxes";
import { Entity } from "../../../../entities/entity";
import { MeleeAttack } from "../../../attackModule/meleeAttack";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class BattleCry extends Feat {
  constructor(entity: Entity) {
    super("battle_cry", entity);

    this.cooldown = 30;
  }

  effect() {
    const battleCry: IWeapon = {
      _id: "battle_cry",
      attackForce: 300,
      attackSpeed: 0,
      damage: this.entity.finalStats.CHA * 2,
      damageBonuses: [],
      damageType: "force",
      description: "",
      group: "misc",
      name: "battle_cry",
      requiredLevel: 0,
      traits: [],
      statusEffects: [{ name: "chilled", duration: 12_000, level: 1 }],
    };

    const width = 100;
    const getHitBoxRect = (): Rectangle => {
      return {
        x: this.entity.x - width / 2,
        y: this.entity.y - width / 2,
        width: width,
        height: width,
      };
    };

    const attack = new MeleeAttack(this.entity, battleCry, getHitBoxRect);
    attack.execute();
  }
}
