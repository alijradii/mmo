import { Player } from "../../player/player";
import { Entity } from "../entity";
import { State } from "./state";

export class StunnedState extends State {
  duration: number = 0;

  constructor(entity: Entity, duration: number) {
    super("stunned", entity);
    this.duration = duration;
  }

  update() {
    if (this.duration <= 0) this.entity.setState(this.entity.idleState);

    if (this instanceof Player) this.inputQueue.length = 0;

    this.entity.updatePhysics();
    this.duration--;
  }

  onExit() {
    this.entity.clearInupt();
  }
}
