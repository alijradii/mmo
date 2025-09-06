import { Entity } from "../../../../entities/entity";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";
import { RegenerationStatusEffect } from "../../../statusEffects/buffs/regenerationStatusEffect";

@entity
export class SecondWind extends Feat {
  constructor(entity: Entity) {
    super("second_wind", entity);

    this.cooldown = 120;
  }

  effect() {
    const effect = new RegenerationStatusEffect({
      duration: 4_000,
      amount: Math.floor(this.entity.baseStats.WIS),
      interval: 500,
    });

    this.entity.addStatusEffect(effect);
  }
}
