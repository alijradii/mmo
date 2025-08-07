import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../../entities/entity";
import { SkeletonArcher } from "../../entities/mobs/all/skeletonArcher";
import { SkeletonAssassin } from "../../entities/mobs/all/skeletonAssassin";

export const handleCommand = (
  command: string,
  gameRoom: GameRoom,
  senderEntity: Entity
) => {
  command = command.slice(1);

  console.log("received command: ", command);

  if (command === "spawn") {
    console.log("spawned an entity");
    // const entity = new LanternPhantom(gameRoom);
    // entity.x = senderEntity.x - 200;
    // entity.y = senderEntity.y;

    // gameRoom.spawn(entity);

    const wasp_1 = new SkeletonArcher(gameRoom);
    wasp_1.x = senderEntity.x - 250;
    wasp_1.y = senderEntity.y + 40;

    gameRoom.spawn(wasp_1);

    const wasp_2 = new SkeletonAssassin(gameRoom);
    wasp_2.x = senderEntity.x - 200;
    wasp_2.y = senderEntity.y - 40;

    gameRoom.spawn(wasp_2);
  }
};
