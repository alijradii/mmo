import { Entity } from "../../entities/entity";
import { Feat } from "../../modules/feats/feat";
import { Action } from "../core/action";

export class AttackAction extends Action {
  public target: Entity;
  public feat: Feat;

  constructor(entity: Entity, target: Entity, feat: Feat) {
    const cost = feat.castingDuration;

    const conditions: Record<string, any> = {};
    const effects: Record<string, any> = {};

    const terminateEffects: Record<string, any> = {};

    if (feat.ranged) {
      conditions[`within_range_${target.id}`] = true;
    } else conditions[`within_bounds_${target.id}`] = true;

    if (feat.category === "support") {
      effects[`support_${target.id}`] = true;
      terminateEffects[`support_${target.id}`] = false;
    } else {
      effects[`attack_${target.id}`] = true;
      terminateEffects[`attack_${target.id}`] = false;
    }

    super(`feat_${feat.name}_${target.id}`, cost, conditions, effects, entity);

    this.feat = feat;
    this.target = target;
    this.state = "cast";
    this.duration = feat.castingDuration;

    this.terminateEffects = terminateEffects;
  }

  start() {
    super.start();

    if (!this.entity) return;

    this.entity.deltaX = this.target.x - this.entity.x;
    this.entity.deltaY = this.target.y - this.entity.y;
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
      this.feat.use();
    }

    this.timer++;

    if (this.timer === this.duration) {
      this.end();
    }
  }
}
