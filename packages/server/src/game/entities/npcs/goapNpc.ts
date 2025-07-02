import { aiClient } from "../../../ai/AiClient";
import { Action } from "../../../data/types/action";
import { AiAgentResponse } from "../../../data/types/aiAgentResponse";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { NpcAgent } from "../../goap/agents/npcAgent";
import { Goal } from "../../goap/core/goal";
import { GoapAgent } from "../../goap/core/goapAgent";
import { Player } from "../../player/player";
import { entity } from "@colyseus/schema";
import { Entity } from "../entity";

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
    console.log("received message: ", message);

    if (senderEntity.party !== this.party || message[0] === "/") return;

    aiClient.send({
      type: "event",
      event: "chat",
      room_id: this.world.roomId,
      receiver: this.id,
      sender: senderEntity.id,
      content: message,
    });
  }

  sendMessage(message: string) {
    this.world.handleChatMessage({ senderEntity: this, content: message });

    console.log("sending message: ", message);
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

  override processAction(msg: Action): void {
    const target: Entity | undefined = this.world
      .getAllEntities()
      .find((e) => e.id === msg.target_id);

    let goal: Goal | null = null;

    switch (msg.action) {
      case "follow":
        goal = new Goal(
          `Follow ${msg.target_id}`,
          12,
          {
            [`within_bounds_${msg.target_id}`]: true,
          },
          this
        );
        break;

      case "flee":
        goal = new Goal(
          `Flee from ${msg.target_id}`,
          12,
          {
            [`within_range_${msg.target_id}`]: false,
          },
          this
        );
        break;

      case "skill":
        break;
    }

    this.sendMessage(msg.dialogue);

    if (!goal) return;

    goal.presistent = true;

    this.goapAgent.goals.push(goal);

    console.log("added a new goal: ", goal.desiredState);
  }
}
