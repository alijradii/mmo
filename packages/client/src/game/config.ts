import { Types } from "phaser";
import { MainScene } from "./scenes/main";
import { PreloaderScene } from "./scenes/preloader";
import * as Colyseus from "colyseus.js";
import { GameModel } from "./models/gameModel";

export const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  width: 960,
  height: 540,
  backgroundColor: "#000000",
  antialias: false,
  autoRound: true,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloaderScene, MainScene],
};

const startGame = (parent: string, client: Colyseus.Client) => {
  return new GameModel({ ...config, parent }, client);
};

export default startGame;
