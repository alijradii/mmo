import { State } from "../../entities/genericStates/state";
import { Player } from "../player";

export class PlayerDashState extends State {
  duration: number;
  declare entity: Player;

  constructor(entity: Player, duration: number, maxSpeed: number) {
    super("dash", entity);
    this.entity = entity;

    this.duration = duration;
    this.stateOverrides = { maxSpeed: maxSpeed };
  }

  update(): void {
    if (this.duration === 0) {
      this.entity.setState(this.entity.idleState);
    }
    
    this.duration--;

    this.entity.inputQueue.length = 0;
    this.entity.updatePhysics();
  }
}
