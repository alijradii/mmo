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
  width: window.innerWidth,
  height: window.innerHeight,
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
  const game = new GameModel({ ...config, parent }, client);

  return game;
};

export default startGame;
