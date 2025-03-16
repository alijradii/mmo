import { Types } from "phaser";
import { MainScene } from "./scenes/main";
import { PreloaderScene } from "./scenes/preloader";

export const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  width: 960,
  height: 540,
  backgroundColor: "#09090b",
  antialias: false,
  autoRound: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloaderScene, MainScene],
};
