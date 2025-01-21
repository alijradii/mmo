import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class MoveState extends State {
  entity: Player;

  constructor(entity: Player) {
    super("attack", entity);
  }

  onEnter() {}

  update(): void {
    this.entity.inputQueue = [];
  }
}
