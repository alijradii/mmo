import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { GameModel } from "../models/gameModel";

import { Player as PlayerSchema } from "@backend/schemas/player/player";
import { Player } from "../models/player/player";
import { BaseScene } from "./base";
import { Projectile } from "@backend/schemas/core/projectile";
import { PlayerController } from "../models/input/playerController";
import { getStateCallbacks } from "colyseus.js";
import { ParticleManager } from "../models/particleSystem/particleManager";

export class MainScene extends BaseScene {
  public declare game: GameModel;
  public particleManager!: ParticleManager;
  public playerEntities: {
    [id: string]: Player;
  } = {};

  public projectiles: {
    [id: string]: Phaser.GameObjects.Sprite;
  } = {};

  public player!: Player;
  public playerId!: string;

  private client!: Colyseus.Client;

  playerController!: PlayerController;

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 20;

  currentTick: number = 0;

  constructor() {
    super("main");
  }

  async create(): Promise<void> {
    console.log("New scene created");

    this.client = this.game.client;

    await this.connect();
    const userData = await this.client.auth.getUserData();
    this.playerId = userData.user.id;
    this.currentTick = this.room.state.tick;

    this.playerController = new PlayerController(this);
    this.initTilemap();
    this.initPlayers();
    this.initProjectiles();
    this.cameras.main.setZoom(2);

    this.cameras.main.startFollow(this.playerEntities[userData.user.id]);

    this.particleManager = new ParticleManager(this);
    this.particleManager.init();
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

    if (!tileset) throw new Error("tileset not found");
    map.createLayer("layer1", tileset, 0, 0);
  }

  initPlayers(): void {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).players.onAdd((player: PlayerSchema) => {
      this.playerEntities[player.id] = new Player(
        this,
        player,
        player.id === this.playerId
      );
      this.playerEntities[player.id].showUsernameText(
        this.playerController.showNameTags
      );
    });

    $(this.room.state).players.onRemove((player) => {
      const entity: Player = this.playerEntities[player.id];
      if (entity) {
        entity.shadow.destroy();
        entity.destroy();
        delete this.playerEntities[player.id];
      }
    });

    this.player = this.playerEntities[this.playerId];
    this.currentTick = this.room.state.tick;
  }

  initProjectiles(): void {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).projectiles.onAdd((projectile: Projectile) => {
      const angle = Math.atan2(projectile.yVelocity, projectile.xVelocity);
      this.projectiles[projectile.id] = this.add.sprite(
        projectile.x,
        projectile.y,
        "arrow"
      );
      this.projectiles[projectile.id].setRotation(angle);
      this.projectiles[projectile.id].depth = projectile.y - 20;

      $(projectile).onChange(() => {
        this.projectiles[projectile.id].x = projectile.x;
        this.projectiles[projectile.id].y = projectile.y;

        this.projectiles[projectile.id].depth = projectile.y - 20;
      });
    });

    $(this.room.state).projectiles.onRemove((projectile) => {
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

    this.playerController.collectInput(this.currentTick);
    this.currentTick++;
  }
}
