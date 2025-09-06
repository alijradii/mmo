import { Entity } from "../../../../entities/entity";
import { RegenerationStatusEffect } from "../../../statusEffects/buffs/regenerationStatusEffect";
import { Support } from "../../../supportModule/support";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class HealFeat extends Feat {
  constructor(entity: Entity) {
    super("heal", entity);

    this.cooldown = 10;
    this.category = "support";
  }

  effect() {
    const statusEffect = new RegenerationStatusEffect({
      amount: this.entity.finalStats.WIS * 4,
      duration: 2 * 1000,
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
      name: "heal_2",
    });
  }
}
