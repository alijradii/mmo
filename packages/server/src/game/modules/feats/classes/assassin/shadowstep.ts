import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { Feat } from "../../feat";
import { entity } from "@colyseus/schema";

@entity
export class ShadowStepFeat extends Feat {
  constructor(entity: Entity) {
    super("shadowstep", entity);

    this.cooldown = 20;
  }

  effect() {
    this.entity.world.broadcast("particle-spawn", {
      x: this.entity.x,
      y: this.entity.y,
      name: "smoke_1",
    });

    if (this.entity instanceof Player) {
      this.entity.x += this.entity.deltaX;
      this.entity.y += this.entity.deltaY;
    }
  }
}
