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

  onEnter() {
    this.duration = this.entity.autoAttack.cooldown;
  }

  update(): void {
    this.entity.inputQueue.length = 0;

    if (this.duration === 16) {
      this.entity.autoAttack.execute(1);
    }

    if (this.duration <= 0) this.entity.setState(this.entity.idleState);
    this.duration--;
  }
}
