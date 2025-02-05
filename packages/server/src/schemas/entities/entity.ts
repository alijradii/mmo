import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "../core/rigidBody";
import { type } from "@colyseus/schema";
import { State } from "./genericStates/state";
import { Rectangle } from "../../utils/hitboxes";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  @type("string")
  direction: string = "down";

  @type("number")
  STR: number = 0;

  @type("number")
  DEX: number = 0;

  @type("number")
  CON: number = 0;

  @type("number")
  CHA: number = 0;

  @type("number")
  INT: number = 0;

  @type("number")
  WIA: number = 0;

  @type("number")
  HP: number = 0;

  @type("number")
  MAX_HP: number = 0;

  private serverState: State;
  public idleState: State;
  
  public deltaX: number = 0;
  public deltaY: number = 0;

  constructor(world: GameRoom) {
    super(world);

    this.idleState = new State("idle", this);
    this.serverState = this.idleState;
    this.setState(this.serverState);
  }
  
  getFriction(): number {
    if(this.state === "stunned") return 0.2;
    
    return 1;
  }

  getState() {
    return this.serverState;
  }

  setState(state: State) {
    this.serverState.onExit();

    this.serverState = state;
    this.state = this.serverState.name;

    this.serverState.onEnter();
  }

  update() {}

  getHitBoxRect(): Rectangle {
    return { x: 0, y: 0, height: 0, width: 0 };
  }
  
  clearInupt() {}
  kill() {
  }
}
