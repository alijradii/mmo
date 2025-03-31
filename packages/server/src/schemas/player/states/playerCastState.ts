import { State } from "../../entities/genericStates/state";
import { Feat } from "../../modules/feats/feat";
import { Player } from "../player";

export class PlayerCastState extends State {
  declare entity: Player;

  feat: Feat;
  finishTime: number = 0;

  constructor(entity: Player, feat: Feat) {
    super("cast", entity);

    this.entity = entity;
    this.feat = feat;
  }

  onEnter(): void {
    this.finishTime = Date.now() + this.feat.castingDuration * 1000;
  }

  update(): void {
    this.entity.inputQueue.length = 0;

    if (Date.now() > this.finishTime) {
      this.entity.setState(this.entity.idleState);
      this.feat.use();
    }
  }

  isValid(): boolean {
    return this.feat.isReady;
  }
}
