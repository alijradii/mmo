import { Room, Client } from "@colyseus/core";
import { GameState } from "@/schemas/gameState";
import { Player, PlayerInput } from "@/schemas/player";

import { JWT } from "@colyseus/auth";

import http from "http";
import { Vector } from "vecti";

export class GameRoom extends Room<GameState> {
  maxClients = 100;
  fixedTimeStep = 1000 / 40;

  static async onAuth(token: string, request: http.IncomingMessage) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    this.setState(new GameState());
    this.autoDispose = false;

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
    this.updatePlayers();
  }

  updatePlayers() {
    const velocity = 2;

    this.state.players.forEach((player) => {
      let input: PlayerInput;
      while ((input = player.inputQueue.shift())) {
        let dx = 0;
        let dy = 0;

        if (input.left) {
          dx = -1;
        } else if (input.right) {
          dx = 1;
        }

        if (input.up) {
          dy = -1;
        } else if (input.down) {
          dy = 1;
        }
        
        const delta = new Vector(dx, dy)
        delta.normalize()


        player.x += delta.x * velocity;
        player.y += delta.y * velocity;

        player.tick = input.tick;
      }
    });
  }
}
