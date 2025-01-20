import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "./rigidBody";
import { type } from "@colyseus/schema";
import { State } from "./state";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  _state: State;

  constructor(room: GameRoom) {
    super(room);

    this.setState(new State("idle", this));
  }

  getState() {
    return this._state;
  }

  setState(state: State) {
    this._state = state;
    this.state = this._state.name;
  }

  update() {}
}
