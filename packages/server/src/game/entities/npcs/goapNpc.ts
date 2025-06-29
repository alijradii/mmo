// import { aiClient } from "../../../ai/AiClient";
import { Action } from "../../../data/types/action";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { NpcAgent } from "../../goap/agents/npcAgent";
import { GoapAgent } from "../../goap/core/goapAgent";
import { Player } from "../../player/player";
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
    if (!message || !senderEntity) return;
  }

  sendMessage(message: string) {
    if (!message) return;
  }

  updatePhysics(): void {
    super.updatePhysics();

    if (this.accelDir.x !== 0 || this.accelDir.y !== 0) {
      this.direction = getDirectionFromVector({
        x: this.accelDir.x,
        y: this.accelDir.y,
      });
    }

    if (this.z > 0) {
      this.state = "jump";
    }

    if (this.z <= 0 && this.state === "jump") {
      this.state = "idle";
      this.accelDir.x = 0;
      this.accelDir.y = 0;
      this.xVelocity = 0;
      this.yVelocity = 0;
    }
  }

  jump(): void {
    this.zVelocity = 140;
    this.goapAgent.worldState["state"] = "jump";
  }

  stun(duration: number) {
    this.goapAgent.worldState["stunned"] = duration;
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();

    for (const feat of this.feats) feat.update();
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }

  processAction(action: Action): void {
    console.log(action.action);
  }
}
