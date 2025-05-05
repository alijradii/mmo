import { Room, Client } from "@colyseus/core";
import { GameState } from "../schemas/core/gameState";
import { PlayerActionInput, PlayerMovementInput } from "../schemas/playerInput";
import { Player } from "../schemas/player/player";

import { JWT } from "@colyseus/auth";
import { Rectangle, rectanglesCollider } from "../utils/hitboxes";
import { IPlayer, PlayerModel } from "../database/models/player.model";
import { Projectile } from "../schemas/core/projectile";
import { dataStore } from "../data/dataStore";

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
    this.setState(new GameState());
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
    this.updateProjectiles();
  }

  updatePlayers() {
    this.state.players.forEach((player: Player) => {
      player.update();
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
  }
}
