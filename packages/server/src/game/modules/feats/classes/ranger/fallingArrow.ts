import { Entity } from "../../../../entities/entity";
import { FallingArrowsStatusEffect } from "../../../statusEffects/feats/fallingArrows";
import { Support } from "../../../supportModule/support";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class FallingArrowFeat extends Feat {
  constructor(entity: Entity) {
    super("falling_arrow", entity);

    this.cooldown = 40;
  }

  effect() {
    const statusEffect = new FallingArrowsStatusEffect({
      amount: 0,
      duration: 2 * 1000,
      interval: 100,
    });

    const side = 40;

    const support = new Support(
      this.entity,
      this.entity.x,
      this.entity.y,
      side,
      side,
      statusEffect
    );

    support.affectSelf = true;

    support.execute();
  }
}
