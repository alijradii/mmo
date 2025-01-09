import { Room, Client } from "@colyseus/core";
import { GameState } from "../models/gameState";
import { Player , PlayerInput} from "../models/player";

import { JWT } from "@colyseus/auth";

import http from "http";

export class GameRoom extends Room<GameState> {
  maxClients = 100;
  fixedTimeStep = 1000 / 40;

  static async onAuth(token: string, request: http.IncomingMessage) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    this.setState(new GameState());

    this.onMessage("input", (client, input: PlayerInput) => {
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
        this.fixedTick(this.fixedTimeStep);
      }
    });
  }

  onJoin(client: Client, options?: any): void {
    console.log(`Client joined: ${client.auth.id}`);

    const player: Player = new Player();
    player.id = client.auth.id;

    this.state.players.set(client.auth.id, player);
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(`Client left: ${client.auth.id}`);
    if (this.state.players.has(client.auth.id))
      this.state.players.delete(client.auth.id);
  }

  fixedTick(timeStep: number) {
    const velocity = 2;

    this.state.players.forEach((player) => {
      let input: PlayerInput;
      while (input = player.inputQueue.shift()) {
        if (input.left) {
          player.x -= velocity;
        } else if (input.right) {
          player.x += velocity;
        }

        if (input.up) {
          player.y -= velocity;
        } else if (input.down) {
          player.y += velocity;
        }

        player.tick = input.tick;
      }
    });
  }
}
