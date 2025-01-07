import Phaser from "phaser";
import * as Colyseus from "colyseus.js";

export class GameScene extends Phaser.Scene {
  private client!: Colyseus.Client;
  private room!: Colyseus.Room;
  private player!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "GameScene" });
  }

  async init(): Promise<void> {
    this.client = new Colyseus.Client("ws://localhost:3000");

    try {
      this.room = await this.client.joinOrCreate("overworld");
      console.log(`Joined room: ${this.room.id}`);

    } catch (error) {
      console.error("Failed to join room:", error);
    }
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#ffffff");

  }

  update(): void {

    if (!this.room) return; // Ensure room is connected
  }
}