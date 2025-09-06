import { Entity } from "../../../../entities/entity";
import { MightStatusEffect } from "../../../statusEffects/buffs/mightStatusEffect";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class ToughAsNailsFeat extends Feat {
  constructor(entity: Entity) {
    super("tough_as_nails", entity);

    this.cooldown = 60;
  }

  effect() {
    const strengthBuff = new MightStatusEffect({
      duration: 14_000,
      amount: Math.floor(this.entity.baseStats.STR * 2),
    });

    this.entity.addStatusEffect(strengthBuff);
  }
}
