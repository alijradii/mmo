import { State } from "../../entities/genericStates/state";
import { Player } from "../player";

export class PlayerJumpState extends State {
  declare entity: Player;

  constructor(entity: Player) {
    super("jump", entity);
    this.entity = entity;
  }

  onEnter(): void {
    this.entity.zVelocity = 140;
  }

  update(): void {
    this.entity.inputQueue.length = 0;
    this.entity.updatePhysics();

    if (this.entity.z <= 0) {
      this.entity.setState(this.entity.idleState);
    }
  }
}
