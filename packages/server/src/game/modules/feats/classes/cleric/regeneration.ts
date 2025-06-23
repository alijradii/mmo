import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { HealOverTimeStatusEffect } from "../../../statusEffects/buffs/healOverTime";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class RegenerationFeat extends Feat {
  constructor(entity: Entity) {
    super("regeneration", entity);

    this.cooldown = 20;
  }

  effect() {
    const statusEffect = new HealOverTimeStatusEffect(50, 1);

    statusEffect.initialize(this.entity);
  }
}
