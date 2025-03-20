import { State } from "../../entities/genericStates/state";
import { updatePlayerInput } from "../inputController";
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
    // this.entity.inputQueue.length = 0;
    // this.entity.updatePhysics();
    this.entity.inputQueue.length = 1;
    updatePlayerInput(this.entity, this.world)

    if (this.entity.z <= 0) {
      this.entity.setState(this.entity.idleState);
    }
  }
}
