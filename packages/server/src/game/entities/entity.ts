import { GameRoom } from "../../rooms/gameRoom";
import { RigidBody } from "../core/rigidBody";
import { ArraySchema, entity, MapSchema, type, view } from "@colyseus/schema";
import { State } from "./genericStates/state";
import { Rectangle } from "../../utils/hitboxes";
import { AbilityScores, Ability } from "../modules/abilityScores/abilityScores";
import { StatusEffect } from "../modules/statusEffects/statusEffect";
import { Feat } from "../modules/feats/feat";
import { EventListener } from "../modules/eventListener/eventListener";
import { StatOverrides } from "./statOverrides";
import { Planner } from "./modules/planning/planner";
import { Attack } from "../modules/attackModule/attack";
import { StunnedState } from "./genericStates/stunnedState";
import { Action } from "../../data/types/action";

@entity
export class Entity extends RigidBody {
  @type("string")
  entityType: string = "";

  @type("string")
  state: string = "";

  @type("string")
  direction: string = "down";

  @type("number")
  LEVEL: number = 0;

  @type("number")
  party: number = -1;

  @type("number")
  HP: number = 0;

  @type("number")
  MP: number = 0;

  @type("number")
  TEMP_HP: number = 0;

  @type({ map: "string" })
  appearance = new MapSchema<string>();

  @type("number")
  tick: number = 0;

  @view()
  @type(AbilityScores)
  baseStats: AbilityScores = new AbilityScores();

  @view()
  @type(AbilityScores)
  finalStats: AbilityScores = new AbilityScores();

  @view()
  @type({ map: "number" })
  bonuses = new MapSchema<number>();

  @view()
  @type({ map: "number" })
  resistances = new MapSchema<number>();

  @view()
  @type([StatusEffect])
  statusEffects = new ArraySchema<StatusEffect>();

  @view()
  @type([Feat])
  feats = new ArraySchema<Feat>();

  public statOverrides: StatOverrides = {};

  private serverState: State;
  public idleState: State;

  public deltaX: number = 0;
  public deltaY: number = 0;

  public eventListener: EventListener = new EventListener();

  public planner?: Planner;

  autoAttack: Attack = new Attack(this, {
    _id: "none",
    attackForce: 0,
    attackSpeed: 0,
    damage: 0,
    damageBonuses: [],
    damageType: "force",
    description: "",
    group: "misc",
    name: "none",
    requiredLevel: 0,
    traits: [],
  });

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

  resetFinalStats() {
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
    if (!state.isValid()) return;

    this.serverState.onExit();

    this.serverState = state;
    this.state = this.serverState.name;

    this.serverState.onEnter();
  }

  update() {
    for (let statusEffect of this.statusEffects) {
      statusEffect.update();
    }
  }

  getHitBoxRect(): Rectangle {
    return { x: 0, y: 0, height: 0, width: 0 };
  }

  clearInupt() {}

  addStatusEffect(statusEffect: StatusEffect) {
    this.statusEffects.push(statusEffect);
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

  takeDamage(damage: number) {
    const remainingDamage = Math.max(0, damage - this.TEMP_HP);

    this.TEMP_HP = Math.max(0, this.TEMP_HP - damage);

    this.HP -= remainingDamage;

    if (this.HP < 0) this.kill();
  }

  heal(amount: number) {
    const healedAmount = Math.min(amount, this.finalStats.HP - this.HP);

    this.HP += healedAmount;

    if (healedAmount > 0) {
      this.world.broadcast("particle-damage", {
        x: this.x,
        y: this.y,
        value: healedAmount,
        color: "green",
      });
    }
  }

  jump() {}

  stun(duration: number) {
    this.setState(new StunnedState(this, duration));
  }

  waterRespawn() {
    this.takeDamage(Math.floor(this.finalStats.HP / 12));

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.x = this.respawnPosition.x;
    this.y = this.respawnPosition.y;

    this.setState(this.idleState);
  }

  processAction(action: Action) {
    if(!action.action)
      return;
  }
}
