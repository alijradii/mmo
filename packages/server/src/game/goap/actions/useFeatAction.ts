import { getDirectionFromVector } from "../../../utils/math/vec2";
import { Entity } from "../../entities/entity";
import { Feat } from "../../modules/feats/feat";
import { Action } from "../core/action";

export class UseFeatAction extends Action {
  public target: Entity;
  public feat: Feat;

  constructor(entity: Entity, target: Entity, feat: Feat) {
    const cost = feat.castingDuration;

    const conditions: Record<string, any> = {};
    const effects: Record<string, any> = {};

    if (feat.ranged) {
      conditions[`within_range_${target.id}`] = true;
    } else conditions[`within_bounds_${target.id}`] = true;

    if (feat.category === "support") {
      effects[`support_${target.id}`] = true;
    } else {
      effects[`attack_${target.id}`] = true;
    }

    super(`feat_${feat.name}_${target.id}`, cost, conditions, effects, entity);

    this.feat = feat;
    this.target = target;
    this.state = "cast";
    this.duration = 5;
  }

  start() {
    super.start();

    if (!this.entity) return;

    this.entity.accelDir.x = 0;
    this.entity.accelDir.y = 0;
    this.entity.xVelocity = 0;
    this.entity.yVelocity = 0;
  }

  checkProceduralPrecondition(): boolean {
    return this.feat.isReady;
  }

  perform(): void {
    if (!this.entity || !this.target) return;

    if (this.timer === 0) {
    }

    this.timer++;

    if (this.timer === this.duration) {
      this.entity.deltaX = this.target.x - this.entity.x;
      this.entity.deltaY = this.target.y - this.entity.y;

      this.entity.direction = getDirectionFromVector({
        x: this.entity.deltaX,
        y: this.entity.deltaY,
      });

      this.feat.use();
      this.end();
    }
  }
}
