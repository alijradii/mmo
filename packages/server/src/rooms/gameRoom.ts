import { Room, Client } from "@colyseus/core";
import { GameState } from "../schemas/core/gameState";
import { PlayerInput } from "../schemas/player";
import { Player } from "../schemas/player/player";

import { JWT } from "@colyseus/auth";
import { Rectangle, rectanglesCollider } from "../utils/hitboxes";
import { IPlayer, PlayerModel } from "../database/models/player.model";

export class GameRoom extends Room<GameState> {
  maxClients = 100;
  fixedTimeStep = 1000 / 20;
  tick: number = 0;

  static async onAuth(token: string) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    console.log(options);
    this.setState(new GameState());
    this.autoDispose = false;

    this.onMessage("input", (client, input: PlayerInput) => {
      if (!client.auth) return;

      const player = this.state.players.get(client.auth.id);
      if (player) {
        player.inputQueue.push(input);
      }
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
    
    const playerDocument: IPlayer = await PlayerModel.findById(client.auth.id)
    
    if(!playerDocument) {
      client.leave()
      return;
    }

    const player: Player = new Player(this);
    player.id = client.auth.id;
    player.username = client.auth.username;
    player.hat = playerDocument.gear.hat;
    player.frontextra = playerDocument.gear.frontextra;
    player.head = playerDocument.gear.head;
    player.hair = playerDocument.gear.hair;
    player.backhair = playerDocument.gear.backhair;
    player.top = playerDocument.gear.top;
    player.bottom = playerDocument.gear.bottom;
    player.weapon = playerDocument.gear.weapon;

    this.state.players.set(client.auth.id, player);
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(consented);
    console.log(`Client left: ${client.auth.id}`);
    if (this.state.players.has(client.auth.id))
      this.state.players.delete(client.auth.id);
  }

  fixedTick() {
    this.state.tick += 1;
    this.updatePlayers();
  }

  updatePlayers() {
    this.state.players.forEach((player: Player) => {
      player.update();
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
}
