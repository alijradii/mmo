import { getDirectionFromVector, Vec2Normalize } from "../../../../utils/math/vec2";
import { Entity } from "../../../entities/entity";
import { Player } from "../../../player/player";
import { PlayerDashState } from "../../../player/states/playerDashState";
import { Feat } from "../feat";

export class DashLeapFeat extends Feat {
  constructor(entity: Entity) {
    super("dash", entity);

    this.cooldown = 10;
  }

  effect() {
    if (this.entity instanceof Player) {
      const normalized = Vec2Normalize({
        x: this.entity.deltaX,
        y: this.entity.deltaY,
      });

      this.entity.setState(new PlayerDashState(this.entity, 8, 800));

      this.entity.inputQueue.length = 0;
      
      this.entity.accelDir.x = normalized.x * 2;
      this.entity.accelDir.y = normalized.y * 2;
      
      this.entity.direction = getDirectionFromVector({x: normalized.x, y: normalized.y})

      this.entity.update();
    }
  }
}
