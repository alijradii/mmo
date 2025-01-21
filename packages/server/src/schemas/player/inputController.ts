import { GameRoom } from "../../rooms/gameRoom";
import { getDirectionFromVector } from "../../utils/math/vec2";
import { PlayerInput } from "../player";
import { Player } from "./player";

export const updatePlayerInput = (player: Player, room: GameRoom) => {
  if (!room) {
    console.log("no room found");
    return;
  }

  let input: PlayerInput | undefined;
  while ((input = player.inputQueue.shift())) {
    let dx = 0;
    let dy = 0;

    if (input.up) dy = -1;
    if (input.down) dy = 1;
    if (input.left) dx = -1;
    if (input.right) dx = 1;

    if (dx != 0 || dy != 0) {
      console.log("player input", dx, dy);
    }

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

    player.updatePhysics();

    player.tick = input.tick;
    if (input.attack) {
      player.setState(player.attackState);
    }
  }
};
