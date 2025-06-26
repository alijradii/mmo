import { Action } from "../src/game/goap/core/action";
import { Goal } from "../src/game/goap/core/goal";
import { goapPlanner } from "../src/game/goap/core/planner";

const goals: Goal[] = [];
const actions: Action[] = [];

goals.push(new Goal("idle", 1, { state: "idle" }));
goals.push(new Goal("attack_shiroe", 9, { attack_shiroe: true }));

actions.push(
  new Action("go_to_shiroe", 20, { state: "idle" }, { distance_shiroe: 0 })
);
actions.push(new Action("idle", 20, {}, { state: "idle" }));
actions.push(
  new Action(
    "attack_shiroe",
    20,
    { distance_shiroe: 0 },
    { attack_shiroe: true }
  )
);

const plan = goapPlanner.plan(
  actions,
  { distance_shiroe: 1000 },
  goals[1].desiredState
);

if (plan)
  plan
    .map((a) => a.name)
    .forEach((name, i) => console.log(`${i + 1}. ${name}`));
