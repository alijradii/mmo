import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../entity";
import { entity } from "@colyseus/schema";
import { MobGoapAgent } from "../../goap/agents/mobGaopAgent";
import { GoapAgent } from "../../goap/core/goapAgent";

@entity
export class GoapMob extends Entity {
  goapAgent: GoapAgent;

  constructor(world: GameRoom) {
    super(world);

    this.party = -1;

    this.width = 0;
    this.height = 16;

    this.goapAgent = new MobGoapAgent(this);
  }

  kill() {
    console.log(`${this.entityType} was killed!!`);
    this.world.state.entities.delete(this.id);
  }

  jump() {
    this.zVelocity = 100;
    this.z = 20;
  }

  stun(duration: number) {
    this.goapAgent.worldState["stunned"] = duration;
  }
}
