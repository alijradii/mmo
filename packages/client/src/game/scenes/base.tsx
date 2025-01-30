import { PlayerComponentFactory } from "../utils/playerComponentFactory";

export class BaseScene extends Phaser.Scene {
  playerComponentFactory: PlayerComponentFactory;

  constructor(name: string) {
    super({ key: name });

    this.playerComponentFactory = new PlayerComponentFactory(this);
  }
}
