import {
  loadPlayerAnimations,
  loadPlayerSprites,
  PlayerParts,
} from "../utils/playerAssetLoader";

export class PreloaderScene extends Phaser.Scene {
  private playerPartData!: PlayerParts;
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.spritesheet(
      "placeholder",
      "/assets/spritesheets/player/top/top0.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );

    this.loadPlayerParts().then(() => {
      loadPlayerSprites(this, this.playerPartData);
      this.load.once("complete", () => {
        console.log("loading completed");
      });
    });
  }

  create() {
    loadPlayerAnimations(this, this.playerPartData).then(() => {
      console.log("animation creation completed");
      this.scene.start("main");
    });
  }

  async loadPlayerParts() {
    const response = await fetch("/assets/data/spritesheets/player.json");
    this.playerPartData = await response.json();
  }
}
