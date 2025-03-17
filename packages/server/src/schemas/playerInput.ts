export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  attack?: boolean;
  secondary?: boolean;
  deltaX: number;
  deltaY: number;

  tick: number;
}

export interface PlayerMovementInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  tick: number;
}

export interface PlayerActionInput {
  action: AvailablePlayerActions;
  value: number;
  deltaX: number;
  deltaY: number;
}

export interface PlayerActionInput {}

export enum AvailablePlayerActions {
  NONE = 0,
  JUMP = 1,
  ATTACK = 2,
}
