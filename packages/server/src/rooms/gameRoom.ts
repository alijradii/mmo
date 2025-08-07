import { Room, Client } from "@colyseus/core";
import { GameState } from "../game/core/gameState";
import { PlayerActionInput, PlayerMovementInput } from "../game/playerInput";
import { Player } from "../game/player/player";

import { JWT } from "@colyseus/auth";
import { Rectangle, rectanglesCollider } from "../utils/hitboxes";
import {
  IPlayer,
  NPCModel,
  PlayerModel,
} from "../database/models/player.model";
import { Projectile } from "../game/core/projectile";
import { dataStore } from "../data/dataStore";
import { StateView } from "@colyseus/schema";
import { getManhattanDistance } from "../utils/math/helpers";
import { ChatMessage } from "../game/modules/chat/chat";
import { NPC } from "../game/entities/npcs/goapNpc";
import { aiClient } from "../ai/AiClient";
import { Entity } from "../game/entities/entity";
import { handleCommand } from "../game/modules/commands/commandHandler";
import { GameObject } from "../game/core/gameObject";
import { MapData, MAPS_DATA } from "../data/maps/mapData";
import { MobFactory } from "../game/entities/mobs/mobFactory";

export interface MapInfo {
  name: string;
  width: number;
  height: number;

  heightmap: number[][];
  data: MapData | null;
}

export class GameRoom extends Room<GameState> {
  maxClients = 100;
  fixedTimeStep = 1000 / 20;
  tick: number = 0;
  spawnId: number = 1;

  mapInfo: MapInfo = {
    name: "",
    heightmap: [],
    width: 0,
    height: 0,
    data: null,
  };

  respawn = { x: 50, y: 50 };

  static async onAuth(token: string) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    console.log(options);
    this.state = new GameState();
    this.autoDispose = false;

    this.initMap();
    // this.runSpawnRegions();

    this.state.entityIdCounter = 1;

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
    this.onMessage("inventory-drop", (client, message) => {
      handleInventoryChange(client, "inventory-drop", message);
    });

    this.onMessage("chat", (client, message) => {
      this.handleChatMessage({ client, content: message?.content || "" });
    });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick();
      }
    });

    aiClient.subscribe(this);
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

    if (player.x === 0 && player.y === 0) {
      player.x = this.respawn.x;
      player.y = this.respawn.y;
    }
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

    if (this.state.tick % 20 === 0) {
      aiClient.send({
        type: "game_state",
        id: this.roomId,
        data: this.state.toJSON(),
      });

      this.sendNpcGoapStates();
    }

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

    this.state.gameObjects.forEach((gameObject) => {
      gameObject.update();
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
        player.state !== "dead" &&
        filter(player)
      ) {
        callback(player);
      }
    }

    for (let [id, entity] of this.state.entities) {
      if (!id) continue;
      if (
        rectanglesCollider(hitbox, entity.getColliderRect()) &&
        entity.state !== "dead" &&
        filter(entity)
      ) {
        callback(entity);
      }
    }
  }

  initMap() {
    const mapName = this.roomName;
    const mapData = MAPS_DATA[mapName];

    if (!mapData) {
      throw new Error(
        `Couldn't create map because data doesn't exist - map name: ${mapName}`
      );
    }

    const heightmap = dataStore.heightMaps.get(mapName);
    if (!heightmap) {
      throw new Error(`Heightmap not found for map: ${mapName}`);
    }

    const height = heightmap.length * 16;
    const width = heightmap[0].length * 16;

    this.respawn.x = mapData.spawnPoint.x;
    this.respawn.y = mapData.spawnPoint.y;

    this.mapInfo = {
      name: mapData.name,
      width,
      height,
      heightmap,
      data: mapData,
    };

    this.initNpcs();
  }

  initNpcs() {
    NPCModel.find({}).then((npcs: IPlayer[]) => {
      npcs.forEach((npc) => {
        if (npc._id) this.state.entities.set(npc._id, new NPC(this, npc));

        console.log(npc.username, npc.x, npc.y);
      });
    });
  }

  runSpawnRegions() {
    if (!this.mapInfo.data) return;

    for (const region of this.mapInfo.data.spawnRegions) {
      for (const entitySpawn of region.entities) {
        for (let i = 0; i < entitySpawn.count; i++) {
          const entity = MobFactory(entitySpawn.mob, this);
          const x =
            Math.floor(Math.random() * (region.x2 - region.x1 + 1)) + region.x1;
          const y =
            Math.floor(Math.random() * (region.y2 - region.y1 + 1)) + region.y1;

          entity.x = x;
          entity.y = y;
          this.spawn(entity);
        }
      }
    }
  }

  async handleChatMessage({
    client,
    content,
    senderEntity,
  }: {
    client?: Client;
    senderEntity?: Player;
    content: string;
  }) {
    if (client) {
      senderEntity = this.state.players.get(client.auth.id);
    }
    if (!senderEntity) return;

    if (
      ["660929334969761792", "398969458833752074"].includes(senderEntity.id) &&
      content[0] === "/"
    ) {
      handleCommand(content, this, senderEntity);
    }

    const npcs: NPC[] = Array.from(this.state.entities.values())
      .filter((entity): entity is NPC => entity instanceof NPC)
      .filter(
        (pl) =>
          pl.id !== senderEntity.id &&
          getManhattanDistance({
            ax: pl.x,
            ay: pl.y,
            bx: senderEntity.x,
            by: senderEntity.y,
          }) <= 500
      );

    const received = this.clients.filter((cli) => {
      const pl = this.state.players.get(cli.auth.id);

      return (
        pl &&
        getManhattanDistance({
          ax: senderEntity.x,
          ay: senderEntity.y,
          bx: pl.x,
          by: pl.y,
        }) <= 1000
      );
    });

    const message: ChatMessage = {
      content,
      sender: senderEntity.username,
      type: "player",
    };

    for (const cli of received) {
      cli.send("chat", message);
    }

    for (const npc of npcs) {
      npc.receiveMessage({
        message: message.content,
        senderEntity: senderEntity,
      });
    }

    // aiClient.send(message);
  }

  getAllEntities(): Entity[] {
    return [
      ...this.state.players.values(),
      ...this.state.entities.values(),
    ].filter((e) => e.state !== "dead");
  }

  spawn(entity: Entity) {
    entity.id = this.spawnId.toString();
    this.spawnId++;

    this.state.entities.set(entity.id, entity);
  }

  spawnObject(gameObject: GameObject) {
    gameObject.id = this.spawnId.toString();
    this.spawnId++;

    this.state.gameObjects.set(gameObject.id, gameObject);
  }

  async sendNpcGoapStates() {
    const npcs = this.getAllEntities().filter((e) => e.entityType === "NPC");

    for (const npc of npcs) {
      if (npc instanceof NPC) {
        aiClient.send({
          type: "event",
          event: "agent_goap",
          id: npc.id,
          data: npc.goapAgent.generateDescription(),
        });
      }
    }
  }
}
