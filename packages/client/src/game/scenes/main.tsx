import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { GameModel } from "../models/gameModel";

import { GameState } from "@backend/schemas/core/gameState";
import { PlayerInput } from "@backend/schemas/player";
import { Player as PlayerSchema } from "@backend/schemas/player/player";
import { Player } from "../models/player/player";
import { BaseScene } from "./base";

export class MainScene extends BaseScene {
  public declare game: GameModel;
  public room!: Colyseus.Room<GameState>;
  public playerEntities: {
    [id: string]: Player;
  } = {};
  public player!: Player;
  public playerId!: string;
  private client!: Colyseus.Client;
  private isAttacking: boolean = false;

  cursorKeys!: { [key: string]: Phaser.Input.Keyboard.Key };

  inputPayload: PlayerInput = {
    up: false,
    down: false,
    right: false,
    left: false,
    attack: false,
    tick: 0,
    direction: "up",
  };

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 20;

  currentTick: number = 0;

  constructor() {
    super("main");
  }

  async create(): Promise<void> {
    this.input.mouse?.disableContextMenu();

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
    this.playerId = userData.user.id;
    console.log(userData);
    this.currentTick = this.room.state.tick;

    this.initPlayers();
    this.cameras.main.setZoom(2);
    // this.cameras.main.startFollow(this.playerEntities[userData.user.id])
    //
    this.input.on("pointerdown", () => {
      this.isAttacking = true;
    });
  }

  async connect(): Promise<void> {
    this.room = await this.client.join("overworld");
  }

  initPlayers(): void {
    this.room.state.players.onAdd((player: PlayerSchema) => {
      this.playerEntities[player.id] = new Player(this, player);
    });

    this.room.state.players.onRemove((player) => {
      const entity = this.playerEntities[player.id];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[player.id];
      }
    });

    this.player = this.playerEntities[this.playerId];
    this.player.isMainPlayer = true;
  }

  update(time: number, delta: number): void {
    for (const playerId in this.playerEntities) {
      this.playerEntities[playerId].update();
    }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  fixedTick(time: number, delta: number): void {
    if (!time || !delta) return;

    if (!this.room || !this.player) return;

    for (const playerId in this.playerEntities) {
      this.playerEntities[playerId].fixedUpdate();
    }

    this.currentTick++;

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;
    this.inputPayload.attack = this.isAttacking;
    this.inputPayload.direction = this.player.direction || "down";
    this.room.send("input", this.inputPayload);
    
    this.isAttacking = false;
  }
}
