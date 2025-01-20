import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class MoveState extends State {
  entity: Player;

  constructor(player: Player) {
    super("move", player);
  }

  update(): void {
    updatePlayerInput(this.entity);
  }
}
