import Phaser from "phaser";
import * as Colyseus from "colyseus.js";

export class LoginScene extends Phaser.Scene {
  private client!: Colyseus.Client;

  constructor() {
    super({ key: "LoginScene" });
  }

  preload(): void {
    this.load.image("loginButton", "path/to/login-button.png");
  }

  create(): void {
    this.client = new Colyseus.Client("ws://localhost:3000");

    const loginButton = this.add.image(400, 300, "loginButton").setInteractive();

    loginButton.on("pointerdown", async () => {
      try {
        const userdata = await this.client.auth.signInWithProvider("discord");
        console.log(this.client.auth.token)
        console.log("User data:", userdata);

        this.scene.start("GameScene", { userData: userdata });
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    });

    this.add.text(300, 400, "Click the button to login with Discord", {
      fontSize: "20px",
      color: "#ffffff",
    });
  }
}