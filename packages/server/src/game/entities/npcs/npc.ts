import { aiClient } from "../../../ai/AiClient";
import { Action } from "../../../data/types/action";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { Player } from "../../player/player";
import { Entity } from "../entity";
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
  }

  setState(state: State): void {
    super.setState(state);
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }

  processAction(action: Action): void {
    let target: Entity | undefined = this.world.state.players.get(
      action.target
    );

    if (action.dialogue) this.sendMessage(action.dialogue);

    if (!target) target = this.world.state.entities.get(action.target);

    if (action.action === "follow") {
      if (!target) return;
      this.setState(new ChaseState(this, target));
    }
  }
}
