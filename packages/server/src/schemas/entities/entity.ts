import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "../core/rigidBody";
import { ArraySchema, type } from "@colyseus/schema";
import { State } from "./genericStates/state";
import { Rectangle } from "../../utils/hitboxes";
import { AbilityScores, Ability } from "../modules/abilityScores/abilityScores";
import { StatusEffect } from "../modules/statusEffects/statusEffect";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  @type("string")
  direction: string = "down";

  @type("number")
  HP: number = 0;

  @type("number")
  MP: number = 0;

  @type(AbilityScores)
  baseStats: AbilityScores = new AbilityScores();

  @type(AbilityScores)
  finalStats: AbilityScores = new AbilityScores();

  @type([StatusEffect])
  statusEffects = new ArraySchema<StatusEffect>();

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
    if (this.state === "stunned") return 0.2;

    return 1;
  }

  calculateFinalStats() {
    for (let score of Object.values(Ability)) {
      this.finalStats[score] = this.baseStats[score];
    }
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

  kill() {}

  addStatusEffect(statusEffect: StatusEffect) {
    this.statusEffects.push(statusEffect);
    
    statusEffect.initialize(this);
  }

  removeStatusEffect(name: string) {
    const index = this.statusEffects.findIndex(
      (effect: StatusEffect) => effect.name === name
    );

    if (index !== -1) {
      this.statusEffects[index]?.onExit();
      this.statusEffects.splice(index, 1);
    }
  }
}
