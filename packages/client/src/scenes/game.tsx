import Phaser from "phaser";
import * as Colyseus from "colyseus.js";

export class GameScene extends Phaser.Scene {
  private client!: Colyseus.Client;

  constructor() {
    super({ key: "LoginScene" });
  }

  preload(): void {
    this.load.image("loginButton", "path/to/login-button.png");
  }

  create(): void {
    this.client = new Colyseus.Client("ws://localhost:3000");
  }
}