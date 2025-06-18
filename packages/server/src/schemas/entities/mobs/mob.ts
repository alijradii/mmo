import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { Planner } from "../modules/planning/planner";
import { entity } from "@colyseus/schema";

@entity
export class Mob extends Entity {
  constructor(world: GameRoom) {
    super(world);

    this.planner = new Planner(this);
  }
}
