import { State } from "../../genericStates/state";
import { NPC } from "../npc";

export class NPCJumpState extends State {
  declare entity: NPC;

  prevState?: State;

  constructor(entity: NPC, prevState?: State) {
    super("jump", entity);
    this.entity = entity;
    this.prevState = prevState;
  }

  onEnter(): void {
    this.entity.zVelocity = 140;
  }

  update(): void {
    this.entity.updatePhysics();

    if (this.entity.z <= 0) {
      if (this.prevState) this.entity.setState(this.prevState);
      else this.entity.setState(this.entity.idleState);
    }
  }
}
