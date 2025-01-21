import { State } from "../../core/state";
import { Player } from "../player";

export class AttackState extends State {
  declare entity: Player;
  duration: number;

  constructor(entity: Player) {
    super("attack", entity);
    this.entity = entity;
    this.duration = 20;
  }

  onEnter() {
    this.duration = 20;
  }

  update(): void {
    if (this.duration == 20) console.log(this.entity.direction);

    this.entity.inputQueue.length = 0;

    this.duration--;
    if (this.duration <= 0) this.entity.setState(this.entity.idleState);
  }
}
