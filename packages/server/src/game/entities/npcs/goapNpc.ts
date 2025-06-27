import { aiClient } from "../../../ai/AiClient";
import { Action } from "../../../data/types/action";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { MobGoapAgent } from "../../goap/agents/mobGaopAgent";
import { NpcAgent } from "../../goap/agents/npcAgent";
import { GoapAgent } from "../../goap/core/goapAgent";
import { Player } from "../../player/player";
import { State } from "../genericStates/state";
import { NPCIdleState } from "./states/npcIdleState";
import { entity } from "@colyseus/schema";

@entity
export class NPC extends Player {
  goapAgent: GoapAgent;
  constructor(world: GameRoom, document: IPlayer) {
    super(world, document);

    this.entityType = "NPC";
    this.forceGrounded = true;

    this.goapAgent = new NpcAgent(this);
  }

  receiveMessage({
    message,
    senderEntity,
  }: {
    message: string;
    senderEntity: Player;
  }) {
    return;
  }

  sendMessage(message: string) {
    return;
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

  jump(): void {}

  update() {
    this.goapAgent.update();
    this.updatePhysics();
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }

  processAction(action: Action): void {}
}
