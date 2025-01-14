import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { GameModel } from "../models/gameModel";

import { GameState } from "@backend/schemas/gameState";
import { Player as PlayerSchema, PlayerInput } from "@backend/schemas/player";
import { Player } from "../models/player/player";
import { getDirectionFromVector } from "../utils/vectors";

export class MainScene extends Phaser.Scene {
  public declare game: GameModel;
  public room!: Colyseus.Room<GameState>;
  public playerEntities: {
    [id: string]: Player;
  } = {};
  private client!: Colyseus.Client;

  cursorKeys!: { [key: string]: Phaser.Input.Keyboard.Key };

  inputPayload: PlayerInput = {
    up: false,
    down: false,
    right: false,
    left: false,
    tick: 0,
  };

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 60;

  currentTick: number = 0;

  constructor() {
    super({ key: "main" });
  }

  preload(): void {
    this.load.image(
      "ship_0001",
      "https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png?v=1649945243288"
    );
  }

  async create(): Promise<void> {
    if (this.input.keyboard)
      this.cursorKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      }) as { [key: string]: Phaser.Input.Keyboard.Key };

    this.client = this.game.client;

    await this.connect();
    const userData = await this.client.auth.getUserData();
    console.log(userData);

    this.initPlayers();
    this.cameras.main.zoom = 2;
    // this.cameras.main.startFollow(this.playerEntities[userData.user.id])
  }

  async connect(): Promise<void> {
    this.room = await this.client.join("overworld");
  }

  initPlayers(): void {
    this.room.state.players.onAdd((player: PlayerSchema) => {
      this.playerEntities[player.id] = new Player(this, 300, 300);
      player.onChange(() => {
        const entity = this.playerEntities[player.id];

        entity.setData("x", player.x);
        entity.setData("y", player.y);
        entity.setData("direction", player.direction);
      });
    });

    this.room.state.players.onRemove((player) => {
      const entity = this.playerEntities[player.id];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[player.id];
      }
    });
  }

  update(time: number, delta: number): void {
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  fixedTick(time: number, delta: number): void {
    if (!time || !delta) return;

    if (!this.room) return;

    this.currentTick++;

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;
    this.room.send("input", this.inputPayload);

    for (const playerId in this.playerEntities) {
      const entity = this.playerEntities[playerId];
      if (!entity.data) continue;
      const { x, y, direction } = entity.data.values;

      let dx = x - entity.x;
      let dy = y - entity.y;
      if (Math.abs(dx) < 0.1) dx = 0;
      if (Math.abs(dy) < 0.1) dy = 0;

      if (dx !== 0 || dy !== 0) {
        const dir = getDirectionFromVector({ x: dx, y: dy });
        if ((dx === 0 && dy !== 0) || (dx !== 0 && dy === 0)) {
          entity.setDirection(dir);
        }
        entity.x = Phaser.Math.Linear(entity.x, x, 0.4);
        entity.y = Phaser.Math.Linear(entity.y, y, 0.4);
        
        entity.setState("walk")
      } else if (entity.activeCounter > 0) {
        entity.activeCounter--;
      } else {
        // entity.play("idle")
        // entity.setDirection(direction)
        entity.setState("idle")
      }
    }
  }
}
