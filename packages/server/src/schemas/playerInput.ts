export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  attack?: boolean;
  deltaX: number;
  deltaY: number;

  tick: number;
}