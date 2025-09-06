import { Entity } from "../../../../entities/entity";
import { MightStatusEffect } from "../../../statusEffects/buffs/mightStatusEffect";
import { Support } from "../../../supportModule/support";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class VirtueOfProtectionFeat extends Feat {
  constructor(entity: Entity) {
    super("virtue_of_protection", entity);

    this.cooldown = 60;
    this.category = "support";
  }

  effect() {
    const statusEffect = new MightStatusEffect({
      amount: Math.floor(this.entity.finalStats.WIS / 2),
      duration: 10 * 1000,
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
      name: "paladin_holy_shield",
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
