import { dataStore } from "../models/dataStore";

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/data/tilemaps/master_everything.png");
    this.load.tilemapTiledJSON("map", "assets/data/tilemaps/map.json");

    this.load.spritesheet("arrow", "assets/spritesheets/misc/arrow.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
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
