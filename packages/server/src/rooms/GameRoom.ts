import { Room, Client } from "@colyseus/core";
import { GameState } from "../models/gameState";
import { Player } from "../models/player";

import { JWT } from "@colyseus/auth";

import http from "http"

export class GameRoom extends Room<GameState> {
  maxClients = 100;

  static async onAuth(token: string, request: http.IncomingMessage) {
    return await JWT.verify(token);
  }

  onCreate(options: any): void {
    this.setState(new GameState());

    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.y = message.y;
      }
    });
  }

  onJoin(client: Client, options?: any): void {
    console.log(`Client joined: ${client.sessionId}`);

    const player: Player = new Player();
    player.id = client.sessionId

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(`Client left: ${client.sessionId}`);
    this.state.players.delete(client.sessionId);
  }
}