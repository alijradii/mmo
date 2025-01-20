import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class IdleState extends State {
  entity: Player;

  constructor(player: Player) {
    super("idle", player);
  }

  update(): void {
    updatePlayerInput(this.entity);
  }
}
