import { WorldState } from "../core/worldState";

export const stateMatches = (
  state: WorldState,
  conditions: Partial<WorldState>
): boolean => {
  return Object.entries(conditions).every(
    ([key, value]) => state[key] === value
  );
};

export const goalSatisfied = (
  goal: Partial<WorldState>,
  state: WorldState
): boolean => {
  return stateMatches(state, goal);
};
