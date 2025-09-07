import { Entity } from "../../../../entities/entity";
import { RegenerationStatusEffect } from "../../../statusEffects/buffs/regenerationStatusEffect";
import { Support } from "../../../supportModule/support";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class SongOfValorFeat extends Feat {
  constructor(entity: Entity) {
    super("song_of_valor", entity);

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
      this.entity.x,
      this.entity.y,
      side,
      side,
      statusEffect
    );

    support.execute();

    this.entity.world.broadcast("music-spawn", {
      x: this.entity.x,
      y: this.entity.y,
      intensity: 5,
      duration: 3000,
      spread: 5,
    });

    setTimeout(() => {
      this.entity.world.broadcast("circle-spawn", {
        x: this.entity.x,
        y: this.entity.y,
        xRadius: 40,
        yRadius: 40,
        color: 0xe7ff12,
        duration: 2000,
      });
    }, 1000);
  }
}
