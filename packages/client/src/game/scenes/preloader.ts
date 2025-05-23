import { dataStore } from "../models/dataStore";

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/data/tilemaps/master_everything.png");
    this.load.tilemapTiledJSON("map", "assets/data/tilemaps/prototype.json");

    this.load.spritesheet("arrow", "assets/spritesheets/misc/arrow.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    for (const color of ["red", "green", "orange"]) {
      for (let i = 0; i <= 9; i++) {
        this.load.image(
          `digit_${color}_${i}`,
          `assets/gui/damage-numbers/${color}/${i}.png`
        );
      }
    }
  }

  create() {
    this.loadData().then(() => {
      this.scene.start("main");
    });
  }

  async loadData() {
    await dataStore.init();
  }
}
