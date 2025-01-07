import Phaser from "phaser";
import * as Colyseus from "colyseus.js";

interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
}

export class GameScene extends Phaser.Scene {
  private client!: Colyseus.Client;
  private room!: Colyseus.Room;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerSprites: Map<string, Phaser.GameObjects.Rectangle>;

  constructor() {
    super({ key: "GameScene" });
    this.playerSprites = new Map();
  }

  async init(): Promise<void> {
    // Initialize Colyseus client and connect to the game room
    this.client = new Colyseus.Client("ws://localhost:3001");

    try {
      this.room = await this.client.joinOrCreate("game");
      console.log(`Joined room: ${this.room.id}`);

      this.playerSprites.set(this.room.sessionId, this.add.rectangle(
        100, // Initial X position
        100, // Initial Y position
        50,  // Width of the rectangle
        50,  // Height of the rectangle
        0xff0000 // Color (red for the local player)
      ));
      console.log(this.playerSprites)
      // Setup listener for receiving player updates
      this.room.onMessage("updateState", (players: Player[]) => this.handleUpdateState(players));
    } catch (error) {
      console.error("Failed to join room:", error);
    }

    // Setup input keys
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#ffffff");

  }

  update(): void {

    if (!this.room) return; // Ensure room is connected

    const speed = 5;
    let xChange = 0;
    let yChange = 0;

    if (this.cursors.left?.isDown) xChange -= speed;
    if (this.cursors.right?.isDown) xChange += speed;
    if (this.cursors.up?.isDown) yChange -= speed;
    if (this.cursors.down?.isDown) yChange += speed;

    if (xChange !== 0 || yChange !== 0) {
      const playerSprite = this.playerSprites.get(this.room.sessionId);
      if (playerSprite) {
        this.room.send("move", {
          x: playerSprite.x + xChange,
          y: playerSprite.y + yChange,
        });
      }
    }
  }

  private handleUpdateState(players: Player[]): void {
    this.playerSprites.forEach((sprite, id) => {
      if (!players.some(player => player.id === id)) {
        sprite.destroy();
        this.playerSprites.delete(id);
      }
    });

    // Update or add new sprites
    players.forEach((player) => {
      if (!this.playerSprites.has(player.id)) {
        // Create a new sprite for a new player
        const color = Phaser.Display.Color.HexStringToColor(player.color).color;
        const sprite = this.add.rectangle(player.x, player.y, 50, 50, color);
        this.playerSprites.set(player.id, sprite);
      } else {
        // Update existing sprite position
        const sprite = this.playerSprites.get(player.id)!;
        sprite.setPosition(player.x, player.y);
      }
    });
  }
}