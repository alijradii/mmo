import { loadPlayerSprites } from "../utils/playerAssetLoader";

export class PreloaderScene extends Phaser.Scene {
  preload() {
    loadPlayerSprites(this);

    this.load.once("complete", () => {
      console.log("loading completed");
      this.scene.switch("main")
    });
  }
}
