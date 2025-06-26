import { Entity } from "../../entities/entity";
import { AttackAction } from "../actions/attackAction";
import { FollowEntityAction } from "../actions/followEntityAction";
import { EnemyProximitySensor } from "../sensors/enemyProximitySensor";
import { Sensor } from "../sensors/sensor";
import { goalSatisfied } from "../utils/worldStateUtils";
import { Action } from "./action";
import { Goal } from "./goal";
import { goapPlanner } from "./planner";
import { WorldState } from "./worldState";

export class GoapAgent {
  public readonly entity: Entity;

  public actions: Action[] = [];
  public goals: Goal[] = [];
  public sensors: Sensor[] = [];

  public worldState: Partial<WorldState> = {};

  private currentPlan: Action[] = [];
  private currentAction: Action | null = null;

  private currentGoal: Goal | null = null;
  private tickCounter = 0;

  constructor(entity: Entity) {
    this.entity = entity;

    this.updateActions();
    this.updateGoals();

    this.sensors.push(new EnemyProximitySensor(600, 200));
  }

  update() {
    // console.log(this.worldState);
    // console.log(this.currentPlan?.map((p) => p.name));
    // console.log(this.currentAction?.name);
    // console.log(this.goals.map((g) => [g.name, g.priority]));
    // console.log("Best: ", this.currentGoal?.name);
    // console.log(this.)

    if (this.tickCounter++ % 5 === 0) {
      this.updateSensors();
      this.updateActions();
      this.updateGoals();
    }

    if (this.needsNewPlan()) {
      this.buildPlan();
    }

    if (this.currentGoal && this.goalSatisfied(this.currentGoal.desiredState)) {
      this.currentPlan = [];
      this.currentAction = null;
      this.currentGoal = null;
    }

    this.evaluateCurrentAction();
    this.executeCurrentAction();
  }

  private updateSensors() {
    const entities = this.entity.world.getAllEntities();
    for (const sensor of this.sensors) {
      sensor.update(this.worldState, this.entity, entities);
    }
  }

  private needsNewPlan(): boolean {
    // No plan or finished
    if (!this.currentPlan.length && !this.currentAction) return true;

    // Action finished or failed
    if (
      this.currentAction &&
      (this.currentAction.finished || this.currentAction.failed)
    )
      return true;

    // Preconditions no longer satisfied (not just procedural)
    if (
      this.currentAction &&
      (!this.currentAction.checkProceduralPrecondition(this.worldState) ||
        !goapPlanner.stateMatches(
          this.worldState,
          this.currentAction.preconditions
        ))
    )
      return true;

    return false;
  }

  private buildPlan() {
    // Pick highest-priority unsatisfied goal
    const sorted = [...this.goals].sort((a, b) => b.priority - a.priority);
    let bestGoal: Goal | undefined;
    for (const g of sorted) {
      if (!this.goalSatisfied(g.desiredState)) {
        bestGoal = g;
        break;
      }
    }

    if (!bestGoal) {
      this.currentPlan = [];
      this.currentAction = null;
      return;
    }

    this.currentGoal = bestGoal;

    const plan = goapPlanner.plan(
      this.actions,
      this.worldState,
      bestGoal.desiredState
    );

    this.currentPlan = plan ?? [];
    this.terminateCurrentAction();
  }

  private goalSatisfied(goalState: Partial<WorldState>): boolean {
    return Object.entries(goalState).every(
      ([k, v]) => this.worldState[k] === v
    );
  }

  private evaluateCurrentAction() {
    if (
      (this.currentAction && this.currentAction.finished) ||
      (this.currentPlan.length > 0 &&
        goalSatisfied(this.currentPlan[0].preconditions, this.worldState))
    ) {
      this.currentAction?.end();
      this.terminateCurrentAction();
    }
  }

  private executeCurrentAction() {
    if (!this.currentAction && this.currentPlan.length) {
      this.currentAction = this.currentPlan.shift()!;
      this.currentAction.start();
    }

    if (this.currentAction) {
      this.currentAction.perform();

      if (this.currentAction.finished) {
        this.applyActionEffects(this.currentAction);
        this.terminateCurrentAction();
      }

      // Failed? scrap plan
      if (this.currentAction?.failed) {
        this.terminateCurrentAction();
        this.currentPlan = [];
      }
    }
  }

  private applyActionEffects(action: Action) {
    Object.assign(this.worldState, action.effects);
  }

  private terminateCurrentAction() {
    if (this.currentAction) {
      Object.assign(this.worldState, this.currentAction.terminateEffects);
    }

    this.currentAction = null;
  }

  addGoal(goal: Goal) {
    for (const g of this.goals) {
      if (goapPlanner.stateMatches(g.desiredState, goal.desiredState)) {
        console.log("Goal already exists.");
        return;
      }
    }

    this.goals.push(goal);
  }

  updateGoals() {
    this.goals = [];

    const enemyId = this.worldState["enemy_id"];
    this.goals.push(new Goal("idle", 1, { state: "idle" }, this.entity));

    if (enemyId === undefined) {
      return;
    }

    this.goals.push(
      new Goal(
        `attack_${enemyId}`,
        5,
        { [`attack_${enemyId}`]: true },
        this.entity
      )
    );
  }

  updateActions() {
    const entities = this.entity.world.getAllEntities();

    this.actions = [];
    this.actions.push(new Action("idle", 1, {}, { state: "idle" }));

    const enemyId = this.worldState["enemy_id"];

    if (!enemyId) {
      return;
    }

    const target = entities.find((a) => a.id === enemyId);

    if (target) {
      this.actions.push(new FollowEntityAction(this.entity, target, 4));

      this.actions.push(
        new AttackAction(this.entity, target, this.entity.autoAttack)
      );
    }
  }
}
