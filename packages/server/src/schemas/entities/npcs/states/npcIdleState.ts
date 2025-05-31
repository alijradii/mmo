import { State } from "../../genericStates/state";
import { NPC } from "../npc";

export class NPCIdleState extends State {
  private tickCount: number = 0;
  private isThinking: boolean = false;
  private readonly THINK_INTERVAL = 2;

  constructor(entity: NPC) {
    super("idle", entity);
  }

  onEnter(): void {
    // Stop any movement immediately upon entering idle
    this.entity.accelDir.x = 0;
    this.entity.accelDir.y = 0;
    this.entity.xVelocity = 0;
    this.entity.yVelocity = 0;

    // Reset counters
    this.tickCount = 0;
    this.isThinking = false;
  }

  update(): void {
    this.tickCount++;

    this.entity.updatePhysics();

      console.log("thinking");
    if (!this.entity.planner) return;

    if (this.tickCount >= this.THINK_INTERVAL && !this.isThinking) {

      this.isThinking = true;
      this.tickCount = 0;

      this.entity.planner
        .think()
        .catch((err) => {
          console.error("IdleState think() error:", err);
        })
        .finally(() => {
          this.isThinking = false;
        });
    }
  }
}
