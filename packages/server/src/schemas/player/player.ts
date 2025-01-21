import { GameRoom } from "../../rooms/gameRoom";
import { Entity } from "../core/entity";
import { type } from "@colyseus/schema";
import { PlayerInput } from "../player";
import { IdleState } from "./states/playerIdleState";
import { State } from "../core/state";
import { AttackState } from "./states/playerAttackState";

export class Player extends Entity {
  @type("string")
  id: string = "";

  @type("string")
  direction: string = "down";

  @type("number")
  tick: number = 0;

  public attackState: State;
  public inputQueue: PlayerInput[] = [];

  constructor(world: GameRoom) {
    super(world);

    this.idleState = new IdleState(this);
    this.attackState = new AttackState(this);

    this.setState(this.idleState);
  }

  update() {
    if (!this.getState().entity) {
      this.getState().entity = this;
    }

    this.getState().update();
  }
}
