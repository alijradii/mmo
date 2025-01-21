import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "./rigidBody";
import { type } from "@colyseus/schema";
import { State } from "./state";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  private serverState: State;
  public idleState: State;

  constructor(world: GameRoom) {
    super(world);

    this.idleState = new State("idle", this);
    this.serverState = this.idleState;
    this.setState(this.serverState);
  }

  getState() {
    return this.serverState;
  }

  setState(state: State) {
    console.log("Exiting ", this.state);
    this.serverState.onExit();

    this.serverState = state;
    this.state = this.serverState.name;

    console.log("Entering", this.state);
    this.serverState.onEnter();
  }

  update() {}
}
