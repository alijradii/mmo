import { GameRoom } from "../../../rooms/gameRoom";
import { Rectangle } from "../../../utils/hitboxes";
import { Entity } from "../entity";
import { Planner } from "../modules/planning/planner";
import { entity } from "@colyseus/schema";

@entity
export class Mob extends Entity {
  constructor(world: GameRoom) {
    super(world);

    this.party = -1;
    this.HP = 10000000;
    this.planner = new Planner(this);
  }

  kill() {
    this.world.state.entities.delete(this.id);
  }
}
