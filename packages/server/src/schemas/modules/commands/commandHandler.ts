import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../../entities/entity";
import { Mob } from "../../entities/mobs/mob";

export const handleCommand = (
  command: string,
  gameRoom: GameRoom,
  senderEntity: Entity
) => {
  command = command.slice(1);

  console.log("received command: ", command);

  if (command === "spawn") {
    console.log("spawned an entity");
    const entity = new Mob(gameRoom);
    entity.x = senderEntity.x;
    entity.y = senderEntity.y;

    entity.colliderWidth = 28;
    entity.colliderHeight = 32;

    entity.entityType = "lanternphantom";
    entity.appearance.set("sprite", "lanternphantom");

    gameRoom.spawn(entity);

    const created = gameRoom.state.entities.get(entity.id);
    console.log("created at :", created?.x, created?.y);
  }
};
