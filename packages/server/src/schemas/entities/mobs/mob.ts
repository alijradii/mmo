import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { Planner } from "../modules/planning/planner";
import { entity } from "@colyseus/schema";
import { MobIdleState } from "./states/mobIdleState";

@entity
export class Mob extends Entity {
  constructor(world: GameRoom) {
    super(world);

    this.party = -1;
    this.planner = new Planner(this);
    
    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    this.width = 0;
    this.height = 16;
  }

  kill() {
    this.world.state.entities.delete(this.id);
  }

  update() {
    this.getState().update();

    for (const feat of this.feats) feat.update();
  }
}
