import { Types } from "phaser";
import { LoginScene } from "./login";

export const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  width: 640,
  height: 360,
  backgroundColor: "#444444",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LoginScene],
};