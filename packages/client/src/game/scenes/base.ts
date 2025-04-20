import { PlayerComponentFactory } from "../utils/playerComponentFactory";

import * as Colyseus from "colyseus.js";
import { GameState } from "@backend/schemas/core/gameState";

export class BaseScene extends Phaser.Scene {
  public room!: Colyseus.Room<GameState>;
  playerComponentFactory: PlayerComponentFactory;

  constructor(name: string) {
    super({ key: name });

    this.playerComponentFactory = new PlayerComponentFactory(this);
  }
}
