import { WorldState } from "./worldState";

export interface Goal {
  name: string;
  priority: number;
  desiredState: Partial<WorldState>;
}
