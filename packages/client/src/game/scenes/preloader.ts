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

    this.load.spritesheet("magic_bullet", "assets/spritesheets/misc/magic_bullet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("orb", "assets/spritesheets/misc/orb.png", {
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

    this.loadEntitySprites();
  }

  create() {
    this.loadEntityAnimations();

    this.loadData().then(() => {
      this.scene.start("main");
    });
  }

  async loadData() {
    await dataStore.init();
  }

  loadEntitySprites() {
    this.load.spritesheet(
      "lanternphantom",
      "assets/spritesheets/entities/lanternphantom.png",
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  loadEntityAnimations() {
    this.anims.create({
      key: "lanternphantom_idle",
      frames: this.anims.generateFrameNumbers("lanternphantom", {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }
}
