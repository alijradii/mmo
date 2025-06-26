import { WorldState } from "./worldState";

export class Goal {
  public name: string;
  public priority: number;
  public desiredState: Partial<WorldState>;

  constructor(
    name: string,
    priority: number,
    desiredState: Partial<WorldState>
  ) {
    this.name = name;
    this.priority = priority;
    this.desiredState = desiredState;
  }
}
