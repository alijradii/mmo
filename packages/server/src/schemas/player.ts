export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  direction: "up" | "down" | "left" | "right";
  attack?: boolean;

  tick: number;
}