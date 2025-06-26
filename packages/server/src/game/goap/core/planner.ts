import { Action } from "./action";
import { WorldState, applyEffect } from "./worldState";

interface Node {
  state: WorldState;
  parent: Node | null;
  action: Action | null;
  cost: number;
  heuristic: number;
}

export class GoapPlanner {
  plan(
    availableActions: Action[],
    beliefState: WorldState,
    goal: Partial<WorldState>
  ): Action[] | null {
    const open: Node[] = [];
    const closed: Set<string> = new Set();

    const start: Node = {
      state: beliefState,
      parent: null,
      action: null,
      cost: 0,
      heuristic: this.heuristic(beliefState, goal),
    };

    open.push(start);

    while (open.length > 0) {
      open.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic));
      const current = open.shift()!;

      if (this.goalSatisfied(goal, current.state)) {
        return this.reconstructPath(current);
      }

      closed.add(JSON.stringify(current.state));

      for (const action of availableActions) {
        if (!action.checkProceduralPrecondition()) continue;

        const preconds = action.preconditions;
        if (!this.stateMatches(current.state, preconds)) continue;

        const newState = applyEffect(current.state, action.effects);

        const stateKey = JSON.stringify(newState);
        if (closed.has(stateKey)) continue;

        const newNode: Node = {
          state: newState,
          parent: current,
          action: action,
          cost: current.cost + action.cost,
          heuristic: this.heuristic(newState, goal),
        };

        open.push(newNode);
      }
    }

    return null;
  }

  public reconstructPath(node: Node): Action[] {
    const actions: Action[] = [];
    let current: Node | null = node;
    while (current?.action) {
      actions.unshift(current.action);
      current = current.parent;
    }
    return actions;
  }

  public stateMatches(state: WorldState, conditions: Partial<WorldState>): boolean {
    return Object.entries(conditions).every(([key, value]) => state[key] === value);
  }

  public goalSatisfied(goal: Partial<WorldState>, state: WorldState): boolean {
    return this.stateMatches(state, goal);
  }

  public heuristic(state: WorldState, goal: Partial<WorldState>): number {
    let diff = 0;
    for (const key in goal) {
      if (state[key] !== goal[key]) diff++;
    }
    return diff;
  }
}


export const goapPlanner = new GoapPlanner()