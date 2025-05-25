import { Room, Client } from "@colyseus/core";
import { GameState } from "../schemas/core/gameState";
import { PlayerActionInput, PlayerMovementInput } from "../schemas/playerInput";
import { Player } from "../schemas/player/player";

import { JWT } from "@colyseus/auth";
import { Rectangle, rectanglesCollider } from "../utils/hitboxes";
import {
  IPlayer,
  NPCModel,
  PlayerModel,
} from "../database/models/player.model";
import { Projectile } from "../schemas/core/projectile";
import { dataStore } from "../data/dataStore";
import { StateView } from "@colyseus/schema";
import { getManhattanDistance } from "../utils/math/helpers";
import { ChatMessage } from "../schemas/modules/chat/chat";
import { NPC } from "../schemas/entities/npcs/npcs";

export interface MapInfo {
  width: number;
  height: number;

  heightmap: number[][];
}

export class GameRoom extends Room<GameState> {
  maxClients = 100;
  fixedTimeStep = 1000 / 20;
  tick: number = 0;

  mapInfo: MapInfo = {
    heightmap: [],
    width: 0,
    height: 0,
  };

  static async onAuth(token: string) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    console.log(options);
    this.state = new GameState();
    this.autoDispose = false;

    this.initMap();

    const handleInput = (
      client: Client,
      key: string,
      input: PlayerMovementInput | PlayerActionInput
    ) => {
      if (!client.auth) return;

      const player = this.state.players.get(client.auth.id);
      if (player) {
        player.inputQueue.push({
          key,
          value: input,
        });
      }
    };

    this.onMessage("move", (client, input: PlayerMovementInput) => {
      handleInput(client, "move", input);
    });

    this.onMessage("action", (client, input: PlayerActionInput) => {
      handleInput(client, "action", input);
    });

    const handleInventoryChange = (
      client: Client,
      key: string,
      message: any
    ) => {
      const player = this.state.players.get(client.auth.id);
      if (!player) return;

      player.handleInventoryChange(key, message);
    };

    this.onMessage("inventory-move", (client, message) => {
      handleInventoryChange(client, "inventory-move", message);
    });
    this.onMessage("inventory-equip", (client, message) => {
      handleInventoryChange(client, "inventory-equip", message);
    });
    this.onMessage("inventory-unequip", (client, message) => {
      handleInventoryChange(client, "inventory-unequip", message);
    });

    this.onMessage("chat", (client, message) => {
      this.handleChatMessage(client, message?.content || "");
    });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick();
      }
    });
  }

  async onJoin(client: Client, options?: any): Promise<void> {
    console.log(options);
    console.log(`Client joined: ${client.auth.id}`);

    const playerDocument: IPlayer | null = await PlayerModel.findById(
      client.auth.id
    );

    if (!playerDocument) {
      console.log("couldn't find player document for id: ", client.auth.id);
      client.leave();
      return;
    }

    const player: Player = new Player(this, playerDocument);
    this.state.players.set(client.auth.id, player);

    client.view = new StateView();
    client.view.add(player);
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(consented);
    console.log(`Client left: ${client.auth.id}`);
    if (this.state.players.has(client.auth.id)) {
      this.state.players.get(client.auth.id)?.savePost();
      this.state.players.delete(client.auth.id);
    }
  }

  fixedTick() {
    this.state.tick += 1;
    this.updatePlayers();
    this.updateEntities();
    this.updateProjectiles();
  }

  updatePlayers() {
    this.state.players.forEach((player: Player) => {
      player.update();
    });
  }

  updateEntities() {
    this.state.entities.forEach((entity) => {
      entity.update();
    });
  }

  updateProjectiles() {
    this.state.projectiles.forEach((projectile: Projectile) => {
      projectile.update();
    });
  }

  executeCallbackRect(
    hitbox: Rectangle,
    callback: Function,
    filter: Function = function () {
      return true;
    }
  ) {
    for (let [id, player] of this.state.players) {
      if (!id) continue;
      if (
        rectanglesCollider(hitbox, player.getColliderRect()) &&
        filter(player)
      ) {
        callback(player);
      }
    }

    for (let [id, entity] of this.state.entities) {
      if (!id) continue;
      if (
        rectanglesCollider(hitbox, entity.getColliderRect()) &&
        filter(entity)
      ) {
        callback(entity);
      }
    }
  }

  initMap() {
    const height = dataStore.heightmap.length * 16;
    const width = dataStore.heightmap[0].length * 16;
    const heightmap = dataStore.heightmap;

    this.mapInfo = {
      width,
      height,
      heightmap,
    };

    this.initNpcs()
  }

  initNpcs() {
    NPCModel.find({}).then((npcs: IPlayer[]) => {
      npcs.forEach((npc) => {
        if (npc._id) this.state.entities.set(npc._id, new NPC(this, npc));

        console.log(npc.username, npc.x, npc.y)
      });
    });
  }

  async handleChatMessage(client: Client, content: string) {
    const player = this.state.players.get(client.auth.id);
    if (!player) return;

    const received = this.clients.filter((cli) => {
      const pl = this.state.players.get(cli.auth.id);

      return (
        pl &&
        getManhattanDistance({
          ax: player.x,
          ay: player.y,
          bx: pl.x,
          by: pl.y,
        }) <= 1000
      );
    });

    for (const cli of received) {
      const message: ChatMessage = {
        content,
        sender: player.username,
        type: "player",
      };
      cli.send("chat", message);
    }
  }
}
