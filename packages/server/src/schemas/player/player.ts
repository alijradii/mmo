import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../core/entity";
import { type } from "@colyseus/schema";
import { PlayerInput } from "../player";
import { IdleState } from "./states/playerIdleState";

export class Player extends Entity {
  @type("string")
  id: string = "";

  tick: number = 0;

  public inputQueue: PlayerInput[] = [];

  constructor(world: GameRoom) {
    super(world);

    this.setState(new IdleState(this));
  }

  update() {
    if(!this.getState().entity) {
      this.getState().entity = this
    }

    this.getState().update();
  }
}
