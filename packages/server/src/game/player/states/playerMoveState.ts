import { State } from "../../entities/genericStates/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class MoveState extends State {
  declare entity: Player;

  constructor(entity: Player) {
    super("move", entity);
    this.entity = entity;
  }

  update(): void {
    updatePlayerInput(this.entity, this.world);
  }
}
