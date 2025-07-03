import { describe, it, expect } from "vitest";
import { Action } from "../src/game/goap/core/action";
import { Goal } from "../src/game/goap/core/goal";
import { goapPlanner } from "../src/game/goap/core/planner";

describe("GOAP Planner - Goal Prioritization", () => {
  it("creates a valid plan to achieve the 'attack_shiroe' goal", () => {
    const goals: Goal[] = [];
    const actions: Action[] = [];

    goals.push(new Goal("idle", 1, { state: "idle" }));
    goals.push(new Goal("attack_shiroe", 9, { attack_shiroe: true }));

    actions.push(new Action("go_to_shiroe", 20, { state: "idle" }, { distance_shiroe: 0 }));
    actions.push(new Action("idle", 20, {}, { state: "idle" }));
    actions.push(new Action("attack_shiroe", 20, { distance_shiroe: 0 }, { attack_shiroe: true }));

    const worldState = { distance_shiroe: 1000 };
    const goalState = goals[1].desiredState; // { attack_shiroe: true }

    const plan = goapPlanner.plan(actions, worldState, goalState);

    expect(plan).toBeTruthy();

    const planNames = plan!.map((a) => a.name);
    expect(planNames).toEqual(["idle", "go_to_shiroe", "attack_shiroe"]);
  });
});
