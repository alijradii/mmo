import Phaser from "phaser";
import * as Colyseus from "colyseus.js";
import { Game } from "./game";

import { GameState } from "../../../server/src/models/gameState";
import { Player } from "../../../server/src/models/player";

export class GameScene extends Phaser.Scene {
  public declare game: Game;
  public room!: Colyseus.Room<GameState>;
  public playerEntities: {
    [id: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  } = {};
  private client!: Colyseus.Client;

  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: 0,
  };

  elapsedTime: number = 0;
  fixedTimeStep: number = 1000 / 60;

  currentTick: number = 0;

  constructor() {
    super({ key: "LoginScene" });
  }

  preload(): void {
    this.load.image(
      "ship_0001",
      "https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png?v=1649945243288"
    );
  }

  async create(): Promise<void> {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.client = this.game.client;

    console.log(this.client.auth.token);

    await this.connect();
    
    this.initPlayers()
  }

  async connect(): Promise<void> {
    this.room = await this.client.joinOrCreate("overworld");
  }

  initPlayers(): void {
    this.room.state.players.onAdd((player: Player) => {
      this.playerEntities[player.id] = this.physics.add.image(
        player.x,
        player.y,
        "ship_0001"
      );

      player.onChange(() => {
        const entity = this.playerEntities[player.id];

        entity.setData("x", player.x);
        entity.setData("y", player.y);
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

  fixedTick(time, delta) {
    if(!this.room)
      return;

    this.currentTick++;

    const velocity = 2;
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;
    this.room.send("input", this.inputPayload);

    for (const playerId in this.playerEntities) {
      const entity = this.playerEntities[playerId];
      const { x, y } = entity.data.values;

      entity.x = Phaser.Math.Linear(entity.x, x, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, y, 0.2);
    }
  }
}
