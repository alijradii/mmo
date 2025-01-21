import { Types } from "phaser";
import { MainScene } from "./scenes/main";
import { PreloaderScene } from "./scenes/preloader";

export const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  width: 960,
  height: 540,
  backgroundColor: "#444444",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloaderScene, MainScene],
};
