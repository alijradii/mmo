import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { entity } from "@colyseus/schema";
import { Planner } from "../modules/planning/planner";
import { getDirectionFromVector } from "../../../utils/math/vec2";

@entity
export class Mob extends Entity {
//   goapAgent: GoapAgent;

  constructor(world: GameRoom) {
    super(world);

    this.party = -1;

    this.width = 0;
    this.height = 16;

    // this.goapAgent = new MobGoapAgent(this);
    this.planner = new Planner(this);
  }

  kill() {
    console.log(`${this.entityType} was killed!!`);
    this.world.state.entities.delete(this.id);
  }

  updatePhysics(): void {
    super.updatePhysics();

    if (this.accelDir.x !== 0 || this.accelDir.y !== 0) {
      this.direction = getDirectionFromVector({
        x: this.accelDir.x,
        y: this.accelDir.y,
      });
    }
  }

  update() {
    super.update();
    this.getState().update();
  }
}
