import { Action } from "../src/game/goap/core/action";
import { goapPlanner as planner } from "../src/game/goap/core/planner";
import type { WorldState } from "../src/game/goap/core/worldState";

function logTest(title: string, passed: boolean) {
  console.log(`[${passed ? "PASS" : "FAIL"}] ${title}`);
}

// ========== Test 1: Base case ========== //

const initialState1: WorldState = {
  hasMeleeWeapon: true,
  hasRangedWeapon: false,
  pathClear: true,
  atTargetLocation: false,
  nearTarget: false,
  equippedMeleeWeapon: false,
  equippedRangedWeapon: false,
  targetEliminated: false,
};

const goal1 = {
  targetEliminated: true,
};

const actions1: Action[] = [
  new Action(
    "Equip Melee Weapon",
    4,
    { hasMeleeWeapon: true },
    { equippedMeleeWeapon: true }
  ),
  new Action(
    "Equip Ranged Weapon",
    4,
    { hasRangedWeapon: true },
    { equippedRangedWeapon: true }
  ),
  new Action("Go To Target", 20, {}, { atTargetLocation: true }),
  new Action("Go Near Target", 5, {}, { nearTarget: true }),
  new Action(
    "Melee Attack",
    1,
    { atTargetLocation: true, equippedMeleeWeapon: true },
    { targetEliminated: true }
  ),
  new Action(
    "Ranged Attack",
    5,
    { nearTarget: true, equippedRangedWeapon: true },
    { targetEliminated: true }
  ),
];

const plan1 = planner.plan(actions1, initialState1, goal1);

if (!plan1) {
  logTest("Simple GOAP plan exists", false);
} else {
  logTest("Simple GOAP plan exists", true);
  const planNames = plan1.map((a) => a.name);
  console.log("Generated Plan:");
  planNames.forEach((name, i) => console.log(`${i + 1}. ${name}`));

  const validPlans = [
    ["Equip Melee Weapon", "Go To Target", "Melee Attack"],
    ["Equip Ranged Weapon", "Go Near Target", "Ranged Attack"],
  ];

  const matches = validPlans.some(
    (seq) =>
      seq.length === planNames.length &&
      seq.every((step, i) => step === planNames[i])
  );
  logTest("Simple plan matches expected sequence", matches);
}

// ========== Test 2: Complex case ========== //

const initialState2: WorldState = {
  hasMeleeWeapon: false,
  hasMaterials: false,
  nearForge: false,
  pathClear: true,
  atTargetLocation: false,
  nearTarget: false,
  equippedMeleeWeapon: false,
  equippedRangedWeapon: false,
  targetEliminated: false,
};

const goal2 = {
  targetEliminated: true,
};

const actions2: Action[] = [
  new Action(
    "Consume Materials",
    1,
    { hasMaterials: true },
    { hasMaterials: false }
  ),
  new Action(
    "Craft Melee Weapon",
    5,
    { hasMaterials: true, nearForge: true },
    { hasMeleeWeapon: true }
  ),
  new Action("Gather Materials", 2, {}, { hasMaterials: true }),
  new Action(
    "Equip Melee Weapon",
    1,
    { hasMeleeWeapon: true },
    { equippedMeleeWeapon: true }
  ),
  new Action("Go To Target", 10, {}, { atTargetLocation: true }),
  new Action("Move to Forge", 3, {}, { nearForge: true , nearTarget: false, atTargetLocation: false}),
  new Action(
    "Melee Attack",
    1,
    { atTargetLocation: true, equippedMeleeWeapon: true },
    { targetEliminated: true }
  ),
];

const plan2 = planner.plan(actions2, initialState2, goal2);

if (!plan2) {
  logTest("Complex GOAP plan exists", false);
} else {
  logTest("Complex GOAP plan exists", true);
  const planNames = plan2.map((a) => a.name);
  console.log("Generated Plan:");
  planNames.forEach((name, i) => console.log(`${i + 1}. ${name}`));

  const expectedPlan = [
    "Gather Materials",
    "Move to Forge",
    "Craft Melee Weapon",
    "Equip Melee Weapon",
    "Go To Target",
    "Melee Attack",
  ];

  const matches =
    expectedPlan.length === planNames.length &&
    expectedPlan.every((step, i) => step === planNames[i]);

  logTest("Complex plan matches expected sequence", matches);
}

// ========== Test 2: Complex case ========== //

const initialState3: WorldState = {
  hasMeleeWeapon: true,
  hasRangedWeapon: false,
  pathClear: false,
  state: "idling",
  atTargetLocation: false,
  nearTarget: false,
  equippedMeleeWeapon: false,
  equippedRangedWeapon: false,
  targetEliminated: false,
};

const goal3 = {
  targetEliminated: true,
};

const actions3: Action[] = [
  new Action(
    "Equip Melee Weapon",
    4,
    { hasMeleeWeapon: true },
    { equippedMeleeWeapon: true }
  ),
  new Action(
    "Equip Ranged Weapon",
    4,
    { hasRangedWeapon: true },
    { equippedRangedWeapon: true }
  ),
  new Action("Wander", 4, { state: "idling" }, { state: "wandering" }),
  new Action("Find Path", 4, { state: "wandering" }, { pathClear: true }),
  new Action(
    "Go To Target",
    20,
    { pathClear: true },
    { atTargetLocation: true }
  ),
  new Action("Go Near Target", 5, { pathClear: true }, { nearTarget: true }),
  new Action(
    "Melee Attack",
    1,
    { atTargetLocation: true, equippedMeleeWeapon: true },
    { targetEliminated: true }
  ),
  new Action(
    "Ranged Attack",
    5,
    { nearTarget: true, equippedRangedWeapon: true },
    { targetEliminated: true }
  ),
];

const plan3 = planner.plan(actions3, initialState3, goal3);

if (!plan3) {
  logTest("Simple GOAP plan exists", false);
} else {
  logTest("Simple GOAP plan exists", true);
  const planNames = plan3.map((a) => a.name);
  console.log("Generated Plan:");
  planNames.forEach((name, i) => console.log(`${i + 1}. ${name}`));

  const validPlans = [
    [
      "Equip Melee Weapon",
      "Wander",
      "Find Path",
      "Go To Target",
      "Melee Attack",
    ],
    [
      "Equip Ranged Weapon",
      "Wander",
      "Find Path",
      "Go Near Target",
      "Ranged Attack",
    ],
  ];

  const matches = validPlans.some(
    (seq) =>
      seq.length === planNames.length &&
      seq.every((step, i) => step === planNames[i])
  );
  logTest("Simple plan matches expected sequence", matches);
}
