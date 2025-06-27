import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { Planner } from "../modules/planning/planner";
import { entity } from "@colyseus/schema";
import { MobIdleState } from "./states/mobIdleState";
import { State } from "../genericStates/state";

@entity
export class Mob extends Entity {
  constructor(world: GameRoom) {
    super(world);

    this.party = -1;

    this.width = 0;
    this.height = 16;
  }

  kill() {
    console.log(`${this.entityType} was killed!!`);
    this.world.state.entities.delete(this.id);
  }

  jump() {
    this.zVelocity = 100;
    this.z = 20;
  }
}
