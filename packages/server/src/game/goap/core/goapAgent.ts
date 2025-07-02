import { Entity } from "../../entities/entity";
import { Sensor } from "../sensors/sensor";
import { Action } from "./action";
import { Goal } from "./goal";
import { goapPlanner } from "./planner";
import { WorldState } from "./worldState";
import { goalSatisfied } from "../utils/worldStateUtils";

export class GoapAgent {
  public readonly entity: Entity;
  public actions: Action[] = [];
  public goals: Goal[] = [];
  public sensors: Sensor[] = [];
  public worldState: Partial<WorldState> = {};
  public isThinking: boolean = false;

  protected currentPlan: Action[] = [];
  protected currentAction: Action | null = null;
  protected currentGoal: Goal | null = null;
  private tickCounter = 0;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  async update() {
    this.tickCounter++;

    if (this.tickCounter % 10 === 0 && !this.isThinking) {
      this.thinkAsync();
    }

    if (this.currentGoal && this.goalSatisfied(this.currentGoal.desiredState)) {
      this.currentPlan = [];
      this.currentAction = null;
      this.currentGoal = null;
    }

    this.evaluateCurrentAction();
    this.executeCurrentAction();
  }

  private async thinkAsync() {
    this.isThinking = true;

    try {
      await this.updateSensors();
      await this.updateActions();
      await this.updateGoals();

      if (await this.needsNewPlan()) {
        await this.buildPlan();
      }
    } catch (err) {
      console.error("GoapAgent thinkAsync error:", err);
    }

    this.isThinking = false;
  }

  protected async updateSensors() {
    const entities = this.entity.world.getAllEntities();
    for (const sensor of this.sensors) {
      sensor.update(this.worldState, this.entity, entities);
    }
  }

  protected async needsNewPlan(): Promise<boolean> {
    if (!this.currentPlan.length && !this.currentAction) return true;

    if (
      this.currentAction &&
      (this.currentAction.finished || this.currentAction.failed)
    )
      return true;

    if (
      this.currentAction &&
      (!this.currentAction.checkProceduralPrecondition() ||
        !goapPlanner.stateMatches(
          this.worldState,
          this.currentAction.preconditions
        ))
    )
      return true;

    return false;
  }

  async buildPlan() {
    const sortedGoals = [...this.goals].sort((a, b) => b.priority - a.priority);

    for (const goal of sortedGoals) {
      if (this.goalSatisfied(goal.desiredState)) {
        continue;
      }

      const plan = goapPlanner.plan(
        this.actions,
        this.worldState,
        goal.desiredState
      );
      if (plan && plan.length > 0) {
        this.currentGoal = goal;
        this.currentPlan = plan;
        this.terminateCurrentAction();
        return;
      }
    }

    // No valid plan for any goal
    this.currentPlan = [];
    this.currentAction = null;
    this.currentGoal = null;
  }

  protected goalSatisfied(goalState: Partial<WorldState>): boolean {
    return Object.entries(goalState).every(
      ([k, v]) => this.worldState[k] === v
    );
  }

  protected evaluateCurrentAction() {
    if (this.currentGoal && this.goalSatisfied(this.currentGoal.desiredState)) {
      this.currentAction?.end();
      this.terminateCurrentAction();
    }

    if (
      (this.currentAction && this.currentAction.finished) ||
      (this.currentPlan.length > 0 &&
        goalSatisfied(this.currentPlan[0].preconditions, this.worldState))
    ) {
      this.currentAction?.end();
      this.terminateCurrentAction();
    }
  }

  protected executeCurrentAction() {
    if (!this.currentAction && this.currentPlan.length) {
      this.currentAction = this.currentPlan.shift()!;
      this.currentAction.start();
      this.entity.state = this.currentAction.state;
      this.worldState["state"] = this.currentAction.state;
    }

    if (this.worldState["stunned"] && this.worldState["stunned"] > 0) {
      this.worldState["stunned"]--;

      if (this.worldState["stunned"] <= 0) {
        delete this.worldState["stunned"];
      }

      return;
    }

    if (this.currentAction) {
      this.currentAction.perform();

      if (this.currentAction.finished) {
        // this.applyActionEffects(this.currentAction);
        this.terminateCurrentAction();
      }

      if (this.currentAction?.failed) {
        this.terminateCurrentAction();
        this.currentPlan = [];
      }
    }
  }

  protected applyActionEffects(action: Action) {
    Object.assign(this.worldState, action.effects);
  }

  protected terminateCurrentAction() {
    // if (this.currentAction) {
    //   Object.assign(this.worldState, this.currentAction.terminateEffects);
    // }
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

  async updateGoals() {}
  async updateActions() {}

  generateDescription() {
    return {
      current_goal: {
        name: this.currentGoal?.name || "none",
        priority: this.currentGoal?.priority || 0,
        desired_state: this.currentGoal?.desiredState || {},
        persistent: this.currentGoal?.presistent || false,
      },
      goals: this.goals.map((g) => {
        return {
          name: g.name,
          priority: g.priority,
          desired_state: g.desiredState,
          persistent: g.presistent,
        };
      }),
      actions: this.actions.map((a) => {
        return {
          name: a.name,
          effects: a.effects,
          preconditions: a.preconditions,
        };
      }),
      world_state: this.worldState,
    };
  }
}
