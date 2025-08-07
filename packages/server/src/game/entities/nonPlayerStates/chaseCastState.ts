import { Feat } from "../../modules/feats/feat";
import { Entity } from "../entity";
import { MobCastState } from "../mobs/states/mobCastState";
import { ChaseState } from "./chaseState";

export class ChaseCastState extends ChaseState {
  feat: Feat;

  constructor(
    entity: Entity,
    target: Entity,
    feat: Feat,
  ) {
    const arriveRadius = feat.ranged? 400: 16;

    super(entity, target, arriveRadius);
    this.feat = feat;
  }

  onCaught() {
    if (!this.feat.isReady) return;

    this.entity.deltaX = -this.entity.x + this.target.x;
    this.entity.deltaY = -this.entity.y + this.target.y;

    this.entity.setState(new MobCastState(this.entity, this.feat));
  }
}
