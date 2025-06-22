export interface PlayerInput {
  key: string;
  value: PlayerMovementInput | PlayerActionInput;
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

export enum AvailablePlayerActions {
  NONE = 0,
  JUMP = 1,
  ATTACK = 2,
  FEAT = 3,
}
