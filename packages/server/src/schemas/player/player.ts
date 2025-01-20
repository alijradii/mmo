import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../core/entity";
import { type } from "@colyseus/schema";
import { State } from "../core/state";
import { PlayerInput } from "../player";
import { IdleState } from "./states/playerIdleState";

export class Player extends Entity {
  @type("string")
  state: string = "";

  _state: State;
  tick: number;

  public inputQueue: PlayerInput[] = [];

  constructor(room: GameRoom) {
    super(room);

    this.setState(new IdleState(this));
  }

  getState() {
    return this._state;
  }

  setState(state: State) {
    this._state = state;
    this.state = this._state.name;
  }

  update() {
    this._state.update();
  }
}
