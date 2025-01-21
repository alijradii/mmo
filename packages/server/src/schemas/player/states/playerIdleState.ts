import { State } from "../../core/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class IdleState extends State {
  declare entity: Player;

  constructor(entity: Player) {
    super("idle", entity);
    this.entity = entity;
  }

  update(): void {
    updatePlayerInput(this.entity, this.world);
  }
}
