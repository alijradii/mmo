import { MAPS_DATA } from "../../../data/maps/mapData";
import { PlayerModel } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { Entity } from "../../entities/entity";
import { Player } from "../../player/player";
import {
  disbandParty,
  inviteToParty,
  joinParty,
} from "../parties/parties";

export const handleCommand = async (
  command: string,
  gameRoom: GameRoom,
  senderEntity: Entity
) => {
  let args;
  [command, ...args] = command.slice(1).split(" ");

  console.log("received command: ", command);

  if (command === "map") {
    const mapName = args[0];
    const mapData = MAPS_DATA[mapName];

    await PlayerModel.findByIdAndUpdate(senderEntity.id, {
      x: mapData.spawnPoint.x,
      y: mapData.spawnPoint.y,
      map: mapName,
    });

    if (senderEntity instanceof Player) senderEntity.skipSave = true;

    const client = senderEntity.world.clients.filter(
      (c) => c.auth.id === senderEntity.id
    )?.[0];
    if (!client) {
      console.log("client not found", senderEntity.id);
      return;
    }

    client.send("change_map");
  }
  if (command === "spawn") {
    console.log("spawned an entity");
  }

  if (command === "HBD") {
    gameRoom.broadcast("play-music", { music: "happy-birthday" });
  }

  if (command === "fix-parties") {
    console.log("Updating all players' party_id to their own id...");
    const players = await PlayerModel.find({});
    let updated = 0;

    for (const player of players) {
      if (player._id) {
        const partyId = player._id;
        if (player.party !== partyId) {
          await PlayerModel.findByIdAndUpdate(player._id, { party: partyId });
          updated++;
        }
      }
    }

    console.log(`Updated ${updated} players' party_id to their own id`);
  }

  // Party commands
  if (senderEntity instanceof Player) {
    if (command === "invite") {
      const targetUsername = args.join(" ");
      if (!targetUsername) {
        const client = senderEntity.world.clients.find(
          (c) => c.auth.id === senderEntity.id
        );
        if (client) {
          client.send("chat", {
            content: "Usage: /invite <username>",
            sender: "SYSTEM",
            type: "system",
          });
        }
        return;
      }

      const result = await inviteToParty(gameRoom, senderEntity, targetUsername);
      const client = senderEntity.world.clients.find(
        (c) => c.auth.id === senderEntity.id
      );
      if (client) {
        client.send("chat", {
          content: result.message,
          sender: "SYSTEM",
          type: "system",
        });
      }
    }

    if (command === "join") {
      const targetUsername = args.join(" ");
      if (!targetUsername) {
        const client = senderEntity.world.clients.find(
          (c) => c.auth.id === senderEntity.id
        );
        if (client) {
          client.send("chat", {
            content: "Usage: /join <username>",
            sender: "SYSTEM",
            type: "system",
          });
        }
        return;
      }

      const result = await joinParty(gameRoom, senderEntity, targetUsername);
      const client = senderEntity.world.clients.find(
        (c) => c.auth.id === senderEntity.id
      );
      if (client) {
        client.send("chat", {
          content: result.message,
          sender: "SYSTEM",
          type: "system",
        });
      }
    }

    if (command === "leave" || command === "disband") {
      const result = await disbandParty(gameRoom, senderEntity);
      const client = senderEntity.world.clients.find(
        (c) => c.auth.id === senderEntity.id
      );
      if (client) {
        client.send("chat", {
          content: result.message,
          sender: "SYSTEM",
          type: "system",
        });
      }
    }
  }
};
