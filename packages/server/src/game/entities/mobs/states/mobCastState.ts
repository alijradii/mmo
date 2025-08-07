import { State } from "../../genericStates/state";
import { Feat } from "../../../modules/feats/feat";
import { Entity } from "../../entity";

export class MobCastState extends State {
  declare entity: Entity;

  feat: Feat;
  finishTime: number = 0;

  constructor(entity: Entity, feat: Feat) {
    super("cast", entity);

    this.entity = entity;
    this.feat = feat;
  }

  onEnter(): void {
    this.finishTime = Date.now() + this.feat.castingDuration * 1000;
  }

  update(): void {
    if (Date.now() > this.finishTime) {
      this.entity.setState(this.entity.idleState);
      this.feat.use();
    }
  }

  isValid(): boolean {
    return this.feat.isReady;
  }
}
