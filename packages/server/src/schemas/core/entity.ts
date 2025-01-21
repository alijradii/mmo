import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "./rigidBody";
import { type } from "@colyseus/schema";
import { State } from "./state";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  private serverState: State;

  constructor(world: GameRoom) {
    super(world);

    this.serverState = new State("idle", this)
    this.setState(this.serverState);
  }

  getState() {
    return this.serverState;
  }

  setState(state: State) {
    this.serverState = state;
    this.state = this.serverState.name;

    this.serverState.onEnter();
  }

  update() {}
}
