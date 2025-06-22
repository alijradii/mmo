import { getDirectionFromVector, Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { Feat } from "../../feat";
import {entity} from "@colyseus/schema"

@entity
export class ShadowStepFeat extends Feat {
  constructor(entity: Entity) {
    super("shadowstep", entity);

    this.cooldown = 20;
  }

  effect() {
    if (this.entity instanceof Player) {
      this.entity.x += this.entity.deltaX;
      this.entity.y += this.entity.deltaY;
    }
  }
}
