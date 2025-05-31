import { State } from "../../genericStates/state";
import { NPC } from "../npc";

export class NPCIdleState extends State {
  constructor(entity: NPC) {
    super("idle", entity);
  }

  onEnter(): void {
    this.entity.accelDir.x = 0;
    this.entity.accelDir.y = 0;
    this.entity.xVelocity = 0;
    this.entity.yVelocity = 0;
  }

  update(): void {
    this.entity.updatePhysics();
  }
}
