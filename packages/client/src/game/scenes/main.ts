import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { GameModel } from "../models/gameModel";

import { Player as PlayerSchema } from "@backend/game/player/player";
import { Entity as EntitySchema } from "@backend/game/entities/entity";

import { Player } from "../models/player/player";
import { BaseScene } from "./base";
import { Projectile } from "@backend/game/core/projectile";
import { PlayerController } from "../models/input/playerController";
import { getStateCallbacks } from "colyseus.js";
import { ParticleManager } from "../models/particleSystem/particleManager";
import { Entity } from "../models/entity/entity";
import { GameObject as GameObjectSchema } from "@backend/game/core/gameObject";
import { GameObject } from "../models/gameObject/gameObject";
import { fetchSeatReservation } from "@/utils/fetchSeatReservation";
import { AudioManager } from "../models/audio/audioManager";

export class MainScene extends BaseScene {
  public declare game: GameModel;
  public particleManager!: ParticleManager;
  public playerEntities: {
    [id: string]: Player;
  } = {};

  public entities: {
    [id: string]: Entity;
  } = {};

  public gameObjects: {
    [id: string]: GameObject;
  } = {};

  public projectiles: {
    [id: string]: Phaser.GameObjects.Sprite;
  } = {};

  public projectileShadows: Record<string, Phaser.GameObjects.Ellipse> = {};

  public player!: Player;
  public playerId!: string;

  private client!: Colyseus.Client;

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 20;

  currentTick: number = 0;

  selectedMap: string;

  audioManager: AudioManager;

  constructor() {
    super("main");

    this.selectedMap = "overworld";
    this.audioManager = new AudioManager(this);
  }

  async create(): Promise<void> {
    this.client = this.game.client;

    await this.connect();
    const userData = await this.client.auth.getUserData();
    this.playerId = userData.user.id;
    this.currentTick = this.room.state.tick;

    this.playerController = new PlayerController(this);
    this.initTilemap();
    this.initPlayers();
    this.initEntities();
    this.initProjectiles();
    this.cameras.main.setZoom(4);

    this.particleManager = new ParticleManager(this);
    this.particleManager.init();
  }

  async connect(): Promise<void> {
    const response = await fetchSeatReservation();
    console.log(response);
    this.selectedMap = response.reservation.room.name;

    this.room = await this.client.consumeSeatReservation(response.reservation);
    this.room.onMessage("change_map", () => {
      window.location.reload();
    });
  }

  initTilemap(): void {
    if (this.selectedMap === "prototype") {
      const map = this.make.tilemap({
        key: "map",
        tileHeight: 16,
        tileWidth: 16,
      });
      const tileset = map.addTilesetImage("master_everything", "tiles");

      if (!tileset) throw new Error("tileset not found");
      map.createLayer("layer1", tileset, 0, 0);
    } else if (this.selectedMap === "overworld") {
      const map = this.make.tilemap({
        key: "overworld_map",
        tileHeight: 16,
        tileWidth: 16,
      });
      const castlesAndCatacombsTiles = map.addTilesetImage(
        "castles_and_catacombs",
        "castles_and_catacombs_tiles"
      );
      const hometownTiles = map.addTilesetImage(
        "master_everything",
        "master2_tiles"
      );

      if (!castlesAndCatacombsTiles || !hometownTiles) {
        throw new Error("tileset not found");
      }
      const tilesets = [castlesAndCatacombsTiles, hometownTiles];

      map.createLayer("Tile Layer 1", tilesets, 0, 0);
      map.createLayer("Tile Layer 2", tilesets, 0, 0);
      map.createLayer("Tile Layer 3", tilesets, 0, 0);
      map.createLayer("Tile Layer 4", tilesets, 0, 0);
      map.createLayer("Tile Layer 5", tilesets, 0, 0);
    } else if (this.selectedMap === "palace_interior") {
      const map = this.make.tilemap({
        key: "castle_interior",
        tileHeight: 16,
        tileWidth: 16,
      });
      const castlesAndCatacombsTiles = map.addTilesetImage(
        "castles_and_catacombs",
        "castles_and_catacombs_tiles"
      );
      const hometownTiles = map.addTilesetImage(
        "master_everything",
        "master2_tiles"
      );

      if (!castlesAndCatacombsTiles || !hometownTiles) {
        throw new Error("tileset not found");
      }
      const tilesets = [castlesAndCatacombsTiles, hometownTiles];

      map.createLayer("background", tilesets, 0, 0);
      map.createLayer("Tile Layer 2", tilesets, 0, 0);
      map.createLayer("Tile Layer 1", tilesets, 0, 0);
      map.createLayer("decorations 3", tilesets, 0, 0);
      map.createLayer("decorations 1", tilesets, 0, 0);
      map.createLayer("decorations 4", tilesets, 0, 0);
      map.createLayer("decorations 2", tilesets, 0, 0);
    } else if (this.selectedMap === "dungeon") {
      const map = this.make.tilemap({
        key: "dungeon_map",
        tileHeight: 16,
        tileWidth: 16,
      });
      const tileset = map.addTilesetImage("master_cavesmines", "dungeon_tiles");

      if (!tileset) throw new Error("tileset not found");
      map.createLayer("layer3", tileset, 0, 0);
      map.createLayer("layer1", tileset, 0, 0);
      map.createLayer("layer2", tileset, 0, 0);
    }
  }

  initPlayers(): void {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).players.onAdd((player: PlayerSchema) => {
      this.playerEntities[player.id] = new Player(
        this,
        player,
        player.id === this.playerId
      );

      if (player.id === this.playerId) {
        this.cameras.main.startFollow(this.playerEntities[this.playerId]);
        this.player = this.playerEntities[this.playerId];
        this.playerController = new PlayerController(this);
      }
    });

    $(this.room.state).players.onRemove((player) => {
      const entity: Player = this.playerEntities[player.id];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[player.id];
      }
    });

    this.currentTick = this.room.state.tick;
  }

  initEntities(): void {
    const $ = getStateCallbacks(this.room);
    $(this.room.state).entities.onAdd((entity: EntitySchema) => {
      if (entity.entityType === "NPC") {
        this.entities[entity.id] = new Player(
          this,
          entity as unknown as PlayerSchema,
          false
        );
      } else {
        this.entities[entity.id] = new Entity(this, entity);
      }
    });

    $(this.room.state).entities.onRemove((entity) => {
      const container = this.entities[entity.id];

      if (container) {
        container.destroy();
      }

      delete this.entities[entity.id];
    });

    $(this.room.state).gameObjects.onAdd((gameObject: GameObjectSchema) => {
      this.gameObjects[gameObject.id] = new GameObject(this, gameObject);
    });

    $(this.room.state).gameObjects.onRemove((gameObject) => {
      const ob = this.gameObjects[gameObject.id];

      if (ob) {
        ob.destroy();
      }

      delete this.gameObjects[gameObject.id];
    });
  }

  initProjectiles(): void {
    const $ = getStateCallbacks(this.room);

    $(this.room.state).projectiles.onAdd((projectile: Projectile) => {
      const angle = Math.atan2(projectile.yVelocity, projectile.xVelocity);

      // initial on-screen Y: rigid projectiles are drawn at y - z, non-rigid use your previous offset
      const screenY = projectile.rigid
        ? projectile.y - projectile.z
        : projectile.y - 8;

      const sprite = this.add.sprite(projectile.x, screenY, projectile.name);
      sprite.setOrigin(0.5, 0.5);

      this.projectiles[projectile.id] = sprite;

      // create shadow only for rigid projectiles
      if (projectile.rigid) {
        const shadow = this.add.ellipse(
          projectile.x,
          projectile.y,
          16,
          8,
          0x000000,
          0.35
        );
        shadow.setOrigin(0.5, 0.5);
        shadow.depth = projectile.y - 13;
        this.projectileShadows[projectile.id] = shadow;
      }

      if (projectile.name === "fireball") {
        sprite.play("particle_fireball");
      }

      if (
        ["bullet", "arrow", "arrow_of_light", "fireball", "shuriken"].includes(
          projectile.name
        )
      ) {
        sprite.setRotation(angle);
      }

      sprite.depth = screenY - 12;

      // sync updates
      $(projectile).onChange(() => {
        const newScreenY = projectile.rigid
          ? projectile.y - projectile.z
          : projectile.y - 8;

        sprite.x = projectile.x;
        sprite.y = newScreenY;
        sprite.depth = newScreenY - 12;

        if (projectile.rigid) {
          // ensure shadow exists
          if (!this.projectileShadows[projectile.id]) {
            const s = this.add.ellipse(
              projectile.x,
              projectile.y,
              16,
              8,
              0x000000,
              0.35
            );
            s.setOrigin(0.5, 0.5);
            this.projectileShadows[projectile.id] = s;
          }
          const shadow = this.projectileShadows[projectile.id];
          shadow.x = projectile.x;
          shadow.y = projectile.y; // ground position
          shadow.depth = projectile.y - 13;
        } else {
          // not rigid -> remove existing shadow if present
          const existing = this.projectileShadows[projectile.id];
          if (existing) {
            existing.destroy();
            delete this.projectileShadows[projectile.id];
          }
        }
      });
    });

    // cleanup on remove
    $(this.room.state).projectiles.onRemove((projectile) => {
      const sprite = this.projectiles[projectile.id];
      if (sprite) {
        sprite.destroy();
        delete this.projectiles[projectile.id];
      }

      const shadow = this.projectileShadows[projectile.id];
      if (shadow) {
        shadow.destroy();
        delete this.projectileShadows[projectile.id];
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

    for (const entityId in this.entities) {
      this.entities[entityId].update();
    }

    for (const gameObjectId in this.gameObjects) {
      this.gameObjects[gameObjectId].update();
    }

    this.playerController.collectInput(this.currentTick);
    this.currentTick++;
  }
}
