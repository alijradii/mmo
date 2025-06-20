import { getDirectionFromVector } from "../../../utils/math/vec2";
import { State } from "../../entities/genericStates/state";
import { Player } from "../player";

export class AttackState extends State {
  declare entity: Player;
  duration: number;

  constructor(entity: Player) {
    super("attack", entity);
    this.entity = entity;
    this.duration = 0;
  }
  
  isValid(){
    return this.entity.autoAttack.isReady();
  }

  onEnter() {
    this.duration = 14;

    if (this.entity.autoAttack.attackType === "ranged") {
      this.entity.direction = getDirectionFromVector({
        x: this.entity.deltaX,
        y: this.entity.deltaY,
      });
    }
  }

  update(): void {
    this.entity.inputQueue.length = 0;

    if (this.duration === 10) {
      this.entity.autoAttack.execute();
    }

    if (this.duration <= 0) this.entity.setState(this.entity.idleState);
    this.duration--;
  }
}
