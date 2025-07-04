import { GameRoom } from "../../rooms/gameRoom";
import { getDirectionFromVector } from "../../utils/math/vec2";
import {
  PlayerInput,
  PlayerActionInput,
  PlayerMovementInput,
  AvailablePlayerActions,
} from "../playerInput";
import { Player } from "./player";
import { PlayerCastState } from "./states/playerCastState";
import { PlayerJumpState } from "./states/playerJumpState";

export const updatePlayerInput = (player: Player, room: GameRoom) => {
  if (!room) {
    console.log("no room found");
    return;
  }

  let input: PlayerInput | undefined;
  while ((input = player.inputQueue.shift())) {
    let dx = 0;
    let dy = 0;

    if (input.key === "move") {
      const movementInput: PlayerMovementInput =
        input.value as PlayerMovementInput;

      if (movementInput.up) dy = -1;
      if (movementInput.down) dy = 1;
      if (movementInput.left) dx = -1;
      if (movementInput.right) dx = 1;

      if (player.z <= 0 && player.state !== "jump") {
        player.accelDir.x = dx;
        player.accelDir.y = dy;

        const dir = getDirectionFromVector({ x: dx, y: dy });
        if ((dx === 0 && dy !== 0) || (dx !== 0 && dy === 0)) {
          player.direction = dir;
        } else if (
          (dy > 0 && player.direction == "up") ||
          (dy < 0 && player.direction == "down") ||
          (dx > 0 && player.direction == "left") ||
          (dx < 0 && player.direction == "right")
        ) {
          player.direction = dir;
        }
      } else {
        if (dx === 0) player.accelDir.x = 0;
        if (dy === 0) player.accelDir.y = 0;
      }
    } else if (
      player.z <= 0 &&
      player.state !== "jump" &&
      input.key === "action"
    ) {
      const actionInput: PlayerActionInput = input.value as PlayerActionInput;
      // console.log(actionInput);

      player.deltaX = actionInput.deltaX;
      player.deltaY = actionInput.deltaY;

      if (actionInput.action === AvailablePlayerActions.ATTACK) {
        if (player.attackState.isValid()) player.setState(player.attackState);
      } else if (actionInput.action === AvailablePlayerActions.JUMP) {
        player.setState(new PlayerJumpState(player));
      } else if (actionInput.action === AvailablePlayerActions.FEAT) {
        const feat = player.feats[actionInput.value];

        if (feat) player.setState(new PlayerCastState(player, feat));
      }
    }

    player.tick = room.state.tick;
    player.updatePhysics();
  }
};
