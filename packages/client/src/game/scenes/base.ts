import { PlayerComponentFactory } from "../utils/playerComponentFactory";

import * as Colyseus from "colyseus.js";
import { GameState } from "@backend/schemas/core/gameState";
import { PlayerController } from "../models/input/playerController";

export class BaseScene extends Phaser.Scene {
  public room!: Colyseus.Room<GameState>;
  playerComponentFactory: PlayerComponentFactory;
  
  playerController!: PlayerController;

  constructor(name: string) {
    super({ key: name });

    this.playerComponentFactory = new PlayerComponentFactory(this);
  }
}
