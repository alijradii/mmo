import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { Game } from "./game";

export class GameScene extends Phaser.Scene {
  public declare game: Game;
  public room!: Colyseus.Room;
  private client!: Colyseus.Client;

  constructor() {
    super({ key: "LoginScene" });
  }

  preload(): void {
  }

  async create(): Promise<void> {
    this.client = this.game.client;
    
    console.log(this.client.auth.token)
    
    await this.connect();
  }
  
  async connect (): Promise<void> {
    this.room = await this.client.joinOrCreate("overworld")
  }
}