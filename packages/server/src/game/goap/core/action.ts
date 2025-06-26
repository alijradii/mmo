import { WorldState } from "./worldState";

export class Action {
  public cost: number = 1;
  public name: string;

  public preconditions: Partial<WorldState>;
  public effects: Partial<WorldState>;

  constructor(name: string, cost: number, preconditions: Partial<WorldState>, effects: Partial<WorldState>){
    this.name = name;
    this.cost = cost;
    this.preconditions = preconditions;
    this.effects = effects;
  }

  checkProceduralPrecondition(state: WorldState): boolean {
    return true;
  }

  perform() {
  }

  toString() {
    return this.name;
  }
}
