import { Entity } from "../../../../entities/entity";
import { HealOverTimeStatusEffect } from "../../../statusEffects/buffs/healOverTime";
import { Support } from "../../../supportModule/support";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class RegenerationFeat extends Feat {
  constructor(entity: Entity) {
    super("regeneration", entity);

    this.cooldown = 60;
    this.category = "support";
  }

  effect() {
    const statusEffect = new HealOverTimeStatusEffect({
      amount: Math.floor(this.entity.finalStats.WIS * 5),
      duration: 100 * 1000,
      interval: 1000,
    });

    const side = 100;

    const support = new Support(
      this.entity,
      this.entity.x + this.entity.deltaX,
      this.entity.y + this.entity.deltaY,
      side,
      side,
      statusEffect
    );

    support.execute();

    this.entity.world.broadcast("particle-spawn", {
      x: this.entity.x + this.entity.deltaX,
      y: this.entity.y + this.entity.deltaY,
      name: "heal",
    });
  }
}
