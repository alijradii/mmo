import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../../entities/entity";
import { LanternPhantom } from "../../entities/mobs/all/goapPhantom";
import { Wasp } from "../../entities/mobs/all/wasp";

export const handleCommand = (
  command: string,
  gameRoom: GameRoom,
  senderEntity: Entity
) => {
  command = command.slice(1);

  console.log("received command: ", command);

  if (command === "spawn") {
    console.log("spawned an entity");
    const entity = new LanternPhantom(gameRoom);
    entity.x = senderEntity.x - 500;
    entity.y = senderEntity.y;

    gameRoom.spawn(entity);

    // const wasp_1 = new Wasp(gameRoom);
    // wasp_1.party = 1;
    // wasp_1.x = senderEntity.x - 450;
    // wasp_1.y = senderEntity.y + 40;

    // gameRoom.spawn(wasp_1);

    // const wasp_2 = new Wasp(gameRoom);
    // wasp_2.x = senderEntity.x - 500;
    // wasp_2.y = senderEntity.y - 40;

    // gameRoom.spawn(wasp_2);
  }
};
