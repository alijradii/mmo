import { getDirectionFromVector } from "../../../utils/math/vec2";
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

    if (this.feat.castingDuration > 0) {
      setTimeout(() => {
        this.entity.world.broadcast("circle-spawn", {
          x: this.entity.x,
          y: this.entity.y,
          xRadius: 8,
          yRadius: 8,
          color: 0xe7ff12,
          duration: this.feat.castingDuration * 1000,
        });
      }, 100);

      if (this.entity.iclass._id === "bard") {
        this.entity.world.broadcast("music-spawn", {
          x: this.entity.x,
          y: this.entity.y,
          intensity: 5,
          duration: this.feat.castingDuration * 1000,
          spread: 5,
          scale: 0.5,
        });
      }
    }

    this.entity.direction = getDirectionFromVector({
      x: this.entity.deltaX,
      y: this.entity.deltaY,
    });

    this.entity.accelDir.x = 0;
    this.entity.accelDir.y = 0;
    this.entity.accelDir.z = 0;
    this.entity.xVelocity = 0;
    this.entity.yVelocity = 0;
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
