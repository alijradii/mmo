import * as Colyseus from "colyseus.js";

export class Game extends Phaser.Game {
  public client!: Colyseus.Client;

  constructor(config: Phaser.Types.Core.GameConfig, client: Colyseus.Client) {
    super(config);
    
    this.client = client;
  }
}
