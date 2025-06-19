import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { Planner } from "../modules/planning/planner";
import { entity } from "@colyseus/schema";

@entity
export class Mob extends Entity {
  constructor(world: GameRoom) {
    super(world);

    this.party = -1;
    this.planner = new Planner(this);
  }

  kill() {
    this.world.state.entities.delete(this.id);
  }
}
