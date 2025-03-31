import { getDirectionFromVector, Vec2Normalize } from "../../../../../utils/math/vec2";
import { Entity } from "../../../../entities/entity";
import { Player } from "../../../../player/player";
import { PlayerFallState } from "../../../../player/states/playerFallState";
import { Feat } from "../../feat";

export class GiantLeapFeat extends Feat {
  constructor(entity: Entity) {
    super("Gaint Leap", entity);

    this.cooldown = 5;
  }

  effect() {
    if (this.entity instanceof Player) {
      const normalized = Vec2Normalize({
        x: this.entity.deltaX,
        y: this.entity.deltaY,
      });

      this.entity.setState(new PlayerFallState(this.entity));
      this.entity.inputQueue.length = 0;
      this.entity.zVelocity = 500;

      this.entity.xVelocity = normalized.x * 200;
      this.entity.yVelocity = normalized.y * 200;
      
      this.entity.accelDir.x = normalized.x * 2;
      this.entity.accelDir.y = normalized.y * 2;
      
      this.entity.direction = getDirectionFromVector({x: normalized.x, y: normalized.y})

      this.entity.update();
    }
  }
}
