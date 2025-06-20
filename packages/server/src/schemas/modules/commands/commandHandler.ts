import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../../entities/entity";
import { LanternPhantom } from "../../entities/mobs/all/lanternphantom";

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
    entity.x = senderEntity.x;
    entity.y = senderEntity.y;

    gameRoom.spawn(entity);

    const created = gameRoom.state.entities.get(entity.id);
    console.log("created at :", created?.x, created?.y);
  }
};
