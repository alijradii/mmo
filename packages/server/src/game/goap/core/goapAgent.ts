import { Entity } from "../../entities/entity";
import { Planner } from "../../entities/modules/planning/planner";
import { Sensor } from "../sensors/sensor";
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

  constructor(entity: Entity) {
    this.entity = entity;
  }

  update() {
    this.updateSensors();

    if (this.needsNewPlan()) {
      this.buildPlan();
    }

    this.executeCurrentAction();
  }

  private updateSensors() {
    const entities = this.entity.world.getAllEntites();
    for (const sensor of this.sensors) {
      sensor.update(this.worldState, this.entity, entities);
    }
  }

  private needsNewPlan(): boolean {
    if (!this.currentPlan.length && !this.currentAction) return true;

    if (this.currentAction && this.currentAction.finished) return true;

    if (
      this.currentAction &&
      !this.currentAction.checkProceduralPrecondition(this.worldState)
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

    const plan = goapPlanner.plan(
      this.actions,
      this.worldState,
      bestGoal.desiredState
    );

    this.currentPlan = plan ?? [];
    this.currentAction = null;
  }

  private goalSatisfied(goalState: Partial<WorldState>): boolean {
    return Object.entries(goalState).every(
      ([k, v]) => this.worldState[k] === v
    );
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
        this.currentAction = null;
      }

      // Failed? scrap plan
      //   if (this.currentAction?.failed) {
      //     this.currentPlan = [];
      //     this.currentAction = null;
      //   }
    }
  }

  private applyActionEffects(action: Action) {
    Object.assign(this.worldState, action.effects);
  }

  addGoal(goal: Goal) {
    for(const g of this.goals) {
        if(goapPlanner.stateMatches(g.desiredState, goal.desiredState)) {
            console.log("Goal already exists.")
            return;
        }
    }

    this.goals.push(goal);
  }
}
