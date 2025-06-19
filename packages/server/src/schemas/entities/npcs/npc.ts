import { aiClient } from "../../../ai/AiClient";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { Player } from "../../player/player";
import { State } from "../genericStates/state";
import { Planner } from "../modules/planning/planner";
import { ChaseState } from "../nonPlayerStates/chaseState";
import { NPCIdleState } from "./states/npcIdleState";
import { NPCJumpState } from "./states/npcJumpState";
import { entity } from "@colyseus/schema";

@entity
export class NPC extends Player {
  constructor(world: GameRoom, document: IPlayer) {
    super(world, document);

    this.entityType = "NPC";
    this.npc = true;
    this.forceGrounded = true;

    this.planner = new Planner(this);
    this.idleState = new NPCIdleState(this);

    this.setState(this.idleState);
  }


  receiveMessage({
    message,
    senderEntity,
  }: {
    message: string;
    senderEntity: Player;
  }) {
    console.log("received message: ", message);
    aiClient.send({
      type: "event",
      event: "chat",
      room_id: this.world.roomId,
      receiver: this.id,
      sender: senderEntity.id,
      content: message
    });

    if (message === "follow me") {
      this.sendMessage("roger");

      this.setState(new ChaseState(this, senderEntity));
    }

    if (message === "attack me" && this.planner) {
      this.sendMessage("attacking!");

      this.planner.hostileEntities = [senderEntity];
      // this.setState(new ChaseAttackState(this, senderEntity, this.autoAttack));
    }
  }

  sendMessage(message: string) {
    this.world.handleChatMessage({ senderEntity: this, content: message });
  }

  jump(): void {
    this.setState(new NPCJumpState(this, this.getState()));
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

  update() {
    super.update();
    this.tick = this.world.state.tick;
  }

  setState(state: State): void {
    super.setState(state)

    console.log("changed state to: ", state.name)
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }
}
