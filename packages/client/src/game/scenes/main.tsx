import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { GameModel } from "../models/gameModel";

import { GameState } from "@backend/schemas/core/gameState";
import { PlayerInput } from "@backend/schemas/playerInput";
import { Player as PlayerSchema } from "@backend/schemas/player/player";
import { Player } from "../models/player/player";
import { BaseScene } from "./base";
import { Projectile } from "@backend/schemas/core/projectile";

export class MainScene extends BaseScene {
  public declare game: GameModel;
  public room!: Colyseus.Room<GameState>;
  public playerEntities: {
    [id: string]: Player;
  } = {};

  public projectiles: {
    [id: string]: Phaser.GameObjects.Sprite;
  } = {};

  public player!: Player;
  public playerId!: string;
  private client!: Colyseus.Client;
  private isAttacking: boolean = false;
  private secondary: boolean = false;

  cursorKeys!: { [key: string]: Phaser.Input.Keyboard.Key };

  inputPayload: PlayerInput = {
    up: false,
    down: false,
    right: false,
    left: false,
    attack: undefined,
    secondary: undefined,
    deltaX: 0,
    deltaY: 0,
    tick: 0,
  };

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 20;

  currentTick: number = 0;
  lastGUIChangeTick: number = 0;
  showNameTags: boolean = false;

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
        z: Phaser.Input.Keyboard.KeyCodes.Z,
        x: Phaser.Input.Keyboard.KeyCodes.X,
      }) as { [key: string]: Phaser.Input.Keyboard.Key };

    this.client = this.game.client;

    await this.connect();
    const userData = await this.client.auth.getUserData();
    this.playerId = userData.user.id;
    this.currentTick = this.room.state.tick;

    this.initTilemap();
    this.initPlayers();
    this.initProjectiles();
    this.cameras.main.setZoom(2);

    this.cameras.main.startFollow(this.playerEntities[userData.user.id]);
    //
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) this.isAttacking = true;
      if (pointer.button === 2) this.secondary = true;
    });
  }

  async connect(): Promise<void> {
    this.room = await this.client.join("overworld");
  }

  initTilemap(): void {
    const map = this.make.tilemap({
      key: "map",
      tileHeight: 16,
      tileWidth: 16,
    });
    const tileset = map.addTilesetImage("master_everything", "tiles");

    // if (!tileset) throw new Error("tileset not found");
    map.createLayer("layer1", tileset, 0, 0);
  }

  initPlayers(): void {
    this.room.state.players.onAdd((player: PlayerSchema) => {
      this.playerEntities[player.id] = new Player(this, player);
      this.playerEntities[player.id].showUsernameText(this.showNameTags);
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

    this.currentTick = this.room.state.tick;
  }

  initProjectiles(): void {
    this.room.state.projectiles.onAdd((projectile: Projectile) => {
      const angle = Math.atan2(projectile.yVelocity, projectile.xVelocity);
      this.projectiles[projectile.id] = this.add.sprite(
        projectile.x,
        projectile.y,
        "arrow"
      );
      this.projectiles[projectile.id].setRotation(angle);
      this.projectiles[projectile.id].depth = projectile.y - 20;

      projectile.onChange(() => {
        this.projectiles[projectile.id].x = projectile.x;
        this.projectiles[projectile.id].y = projectile.y;

        this.projectiles[projectile.id].depth = projectile.y - 20;
      });
    });

    this.room.state.projectiles.onRemove((projectile) => {
      console.log("arrow removed");
      const entity = this.projectiles[projectile.id];
      if (entity) {
        entity.destroy();
        delete this.projectiles[projectile.id];
      }
    });
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

    // handle GUI
    if (
      this.cursorKeys.z.isDown &&
      this.currentTick > this.lastGUIChangeTick + 10
    ) {
      this.cameras.main.setZoom((this.cameras.main.zoom % 3) + 1);
      this.lastGUIChangeTick = this.currentTick;
    }

    if (
      this.cursorKeys.x.isDown &&
      this.currentTick > this.lastGUIChangeTick + 10
    ) {
      this.showNameTags = !this.showNameTags;

      for (const id in this.playerEntities) {
        if (this.playerEntities[id]) {
          const player = this.playerEntities[id];
          player.showUsernameText(this.showNameTags);
        }
      }
      this.lastGUIChangeTick = this.currentTick;
    }

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;

    if (this.isAttacking) {
      this.inputPayload.attack = this.isAttacking;
      const pointer = this.input.activePointer;

      this.inputPayload.deltaX = pointer.worldX - this.player.x;
      this.inputPayload.deltaY = pointer.worldY - this.player.y;
    } else {
      this.inputPayload.attack = undefined;
    }

    if (this.secondary) {
      this.inputPayload.secondary = true;
    } else {
      this.inputPayload.secondary = undefined;
    }
    this.room.send("input", this.inputPayload);

    this.isAttacking = false;
    this.secondary = false;
  }
}
