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
    this.planner = new Planner(this);

    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    this.width = 0;
    this.height = 16;
  }

  kill() {
    console.log(`${this.entityType} was killed!!`);
    this.world.state.entities.delete(this.id);
  }

  update() {
    this.getState().update();

    for (const feat of this.feats) feat.update();
  }

  jump() {
    this.zVelocity = 100;
    this.z = 20;
  }

  setState(state: State): void {
    super.setState(state);
  }
}
