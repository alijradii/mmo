import { IPlayer, NPCModel } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { Player } from "../../player/player";
import { AttackState } from "../nonPlayerStates/attackState";
import { ChaseAttackState } from "../nonPlayerStates/chaseAttackState";
import { ChaseState } from "../nonPlayerStates/chaseState";
import { NPCFollowState } from "./states/npcFollowState";
import { NPCIdleState } from "./states/npcIdleState";
import { NPCJumpState } from "./states/npcJumpState";

export class NPC extends Player {
  constructor(world: GameRoom, document: IPlayer) {
    super(world, document);

    this.entityType = "NPC";
    this.idleState = new NPCIdleState(this);
    this.npc = true;
  }

  receiveMessage({
    message,
    senderEntity,
  }: {
    message: string;
    senderEntity: Player;
  }) {
    console.log("received message: ", message);

    if (message === "follow me") {
      this.sendMessage("roger");

      this.setState(new ChaseState(this, senderEntity));
    }

    if (message === "attack me") {
      this.sendMessage("attacking!");

      this.setState(new ChaseAttackState(this, senderEntity, this.autoAttack));
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

    this.direction = getDirectionFromVector({
      x: this.accelDir.x,
      y: this.accelDir.y,
    });
  }
}
