import { GameRoom } from "../../../rooms/gameRoom";
import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class IdleState extends State {
  entity: Player;
  constructor(entity: Player) {
    super("idle", entity);
  }

  update(): void {
    updatePlayerInput(this.entity, this.world);
  }
}
