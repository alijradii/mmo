import { describe, it, expect } from "vitest";
import { Action } from "../src/game/goap/core/action";
import { goapPlanner as planner } from "../src/game/goap/core/planner";
import type { WorldState } from "../src/game/goap/core/worldState";

describe("GOAP Planner", () => {
  it("creates a valid simple plan", () => {
    const initialState: WorldState = {
      hasMeleeWeapon: true,
      hasRangedWeapon: false,
      pathClear: true,
      atTargetLocation: false,
      nearTarget: false,
      equippedMeleeWeapon: false,
      equippedRangedWeapon: false,
      targetEliminated: false,
    };

    const goal = { targetEliminated: true };

    const actions: Action[] = [
      new Action("Equip Melee Weapon", 4, { hasMeleeWeapon: true }, { equippedMeleeWeapon: true }),
      new Action("Equip Ranged Weapon", 4, { hasRangedWeapon: true }, { equippedRangedWeapon: true }),
      new Action("Go To Target", 20, {}, { atTargetLocation: true }),
      new Action("Go Near Target", 5, {}, { nearTarget: true }),
      new Action("Melee Attack", 1, { atTargetLocation: true, equippedMeleeWeapon: true }, { targetEliminated: true }),
      new Action("Ranged Attack", 5, { nearTarget: true, equippedRangedWeapon: true }, { targetEliminated: true }),
    ];

    const plan = planner.plan(actions, initialState, goal);
    expect(plan).toBeTruthy();

    const planNames = plan!.map((a) => a.name);

    const validPlans = [
      ["Equip Melee Weapon", "Go To Target", "Melee Attack"],
      ["Equip Ranged Weapon", "Go Near Target", "Ranged Attack"],
    ];

    const matches = validPlans.some(
      (seq) => seq.length === planNames.length && seq.every((step, i) => step === planNames[i])
    );

    expect(matches).toBe(true);
  });

  it("creates a valid complex crafting plan", () => {
    const initialState: WorldState = {
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

    const goal = { targetEliminated: true };

    const actions: Action[] = [
      new Action("Consume Materials", 1, { hasMaterials: true }, { hasMaterials: false }),
      new Action("Craft Melee Weapon", 5, { hasMaterials: true, nearForge: true }, { hasMeleeWeapon: true }),
      new Action("Gather Materials", 2, {}, { hasMaterials: true }),
      new Action("Equip Melee Weapon", 1, { hasMeleeWeapon: true }, { equippedMeleeWeapon: true }),
      new Action("Go To Target", 10, {}, { atTargetLocation: true }),
      new Action("Move to Forge", 3, {}, { nearForge: true, nearTarget: false, atTargetLocation: false }),
      new Action("Melee Attack", 1, { atTargetLocation: true, equippedMeleeWeapon: true }, { targetEliminated: true }),
    ];

    const expected = [
      "Gather Materials",
      "Move to Forge",
      "Craft Melee Weapon",
      "Equip Melee Weapon",
      "Go To Target",
      "Melee Attack",
    ];

    const plan = planner.plan(actions, initialState, goal);
    expect(plan).toBeTruthy();

    const planNames = plan!.map((a) => a.name);
    expect(planNames).toEqual(expected);
  });

  it("handles pathfinding + state requirements", () => {
    const initialState: WorldState = {
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

    const goal = { targetEliminated: true };

    const actions: Action[] = [
      new Action("Equip Melee Weapon", 4, { hasMeleeWeapon: true }, { equippedMeleeWeapon: true }),
      new Action("Equip Ranged Weapon", 4, { hasRangedWeapon: true }, { equippedRangedWeapon: true }),
      new Action("Wander", 4, { state: "idling" }, { state: "wandering" }),
      new Action("Find Path", 4, { state: "wandering" }, { pathClear: true }),
      new Action("Go To Target", 20, { pathClear: true }, { atTargetLocation: true }),
      new Action("Go Near Target", 5, { pathClear: true }, { nearTarget: true }),
      new Action("Melee Attack", 1, { atTargetLocation: true, equippedMeleeWeapon: true }, { targetEliminated: true }),
      new Action("Ranged Attack", 5, { nearTarget: true, equippedRangedWeapon: true }, { targetEliminated: true }),
    ];

    const plan = planner.plan(actions, initialState, goal);
    expect(plan).toBeTruthy();

    const planNames = plan!.map((a) => a.name);

    const validPlans = [
      ["Equip Melee Weapon", "Wander", "Find Path", "Go To Target", "Melee Attack"],
      ["Equip Ranged Weapon", "Wander", "Find Path", "Go Near Target", "Ranged Attack"],
    ];

    const matches = validPlans.some(
      (seq) => seq.length === planNames.length && seq.every((step, i) => step === planNames[i])
    );

    expect(matches).toBe(true);
  });
});
