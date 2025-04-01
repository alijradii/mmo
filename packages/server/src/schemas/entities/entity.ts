import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "../core/rigidBody";
import { ArraySchema, type} from "@colyseus/schema";
import { State } from "./genericStates/state";
import { Rectangle } from "../../utils/hitboxes";
import { AbilityScores, Ability } from "../modules/abilityScores/abilityScores";
import { StatusEffect } from "../modules/statusEffects/statusEffect";
import { Bonuses } from "../modules/abilityScores/bonuses";
import { Feat } from "../modules/feats/feat";
import { EventListener } from "../modules/eventListener/eventListener";

export class Entity extends RigidBody {
  @type("string")
  state: string = "";

  @type("string")
  direction: string = "down";

  @type("number")
  LEVEL: number = 0;

  @type("number")
  HP: number = 0;

  @type("number")
  MP: number = 0;

  @type("number")
  TEMP_HP: number = 0;

  @type(AbilityScores)
  baseStats: AbilityScores = new AbilityScores();

  @type(AbilityScores)
  finalStats: AbilityScores = new AbilityScores();

  @type(Bonuses)
  bonuses: Bonuses = new Bonuses();

  @type([StatusEffect])
  statusEffects = new ArraySchema<StatusEffect>();

  @type([Feat])
  feats = new ArraySchema<Feat>();

  private serverState: State;
  public idleState: State;

  public deltaX: number = 0;
  public deltaY: number = 0;
  
  public eventListener: EventListener = new EventListener();

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

    this.finalStats["AC"] = this.baseStats["AC"];
    this.finalStats["HP"] = this.baseStats["HP"];
    this.finalStats["MP"] = this.baseStats["MP"];
  }

  getState() {
    return this.serverState;
  }

  setState(state: State) {
    if(!state.isValid()) return;

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

  hasFeat(name: string): boolean {
    return this.feats.some((feat) => feat.name === name);
  }

  getFeat(name: string): Feat | undefined {
    return this.feats.find((feat) => feat.name === name);
  }

  addFeat(feat: Feat) {
    if (!this.hasFeat(feat.name)) this.feats.push(feat);
  }
}
