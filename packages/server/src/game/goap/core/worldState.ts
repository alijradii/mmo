export type WorldState = Record<string, any>;

export function applyEffect(state: WorldState, effect: Partial<WorldState>): WorldState {
  return { ...state, ...effect };
}

export function statesEqual(a: WorldState, b: WorldState): boolean {
  return Object.keys(a).every(key => a[key] === b[key]) &&
         Object.keys(b).every(key => a[key] === b[key]);
}
