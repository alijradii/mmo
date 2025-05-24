import { IPlayer, NPCModel } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { Player } from "../../player/player";
import { NPCIdleState } from "./states/npcIdleState";

export class NPC extends Player {
 constructor(world: GameRoom, document: IPlayer) {
    super(world, document)

    this.idleState = new NPCIdleState(this);
 }
}