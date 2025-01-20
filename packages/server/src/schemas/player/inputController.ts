import { PlayerInput } from "../player";
import { Player } from "./player";

export const updatePlayerInput = (player: Player) => {
  let input: PlayerInput | undefined;
  while ((input = player.inputQueue.shift())) {
    let dx = 0;
    let dy = 0;

    if (input.up) dy = -1;
    if (input.down) dy = 1;
    if (input.left) dx = -1;
    if (input.right) dx = 1;

    player.accelDir.x = dx;
    player.accelDir.y = dy;

    player.physicsUpdate();

    player.tick = input.tick;
  }
};
