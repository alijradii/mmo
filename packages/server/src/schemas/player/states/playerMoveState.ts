import { GameRoom } from "../../../rooms/gameRoom";
import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class MoveState extends State {
  entity: Player;

  constructor(entity: Player) {
    super("move", entity);
  }

  update(): void {
    updatePlayerInput(this.entity, this.world);
  }
}
