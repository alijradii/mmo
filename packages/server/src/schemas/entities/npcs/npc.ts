import { IPlayer, NPCModel } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { Player } from "../../player/player";
import { NPCFollowState } from "./states/npcFollowState";
import { NPCIdleState } from "./states/npcIdleState";

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

      this.setState(new NPCFollowState(this, senderEntity));
    }
  }

  sendMessage(message: string) {
    this.world.handleChatMessage({ senderEntity: this, content: message });
  }
}
