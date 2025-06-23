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

    this.load.spritesheet(
      "magic_bullet",
      "assets/spritesheets/misc/magic_bullet.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    this.load.spritesheet("orb", "assets/spritesheets/misc/orb.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("shuriken", "assets/spritesheets/misc/shuriken.png", {
      frameWidth: 15,
      frameHeight: 15,
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
    this.loadParticleSprites();
  }

  create() {
    this.loadEntityAnimations();
    this.loadParticleAnimations();

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

  loadParticleSprites() {
    const particleEffects = [
      "impact",
      "whirlwind",
      "fireball",
      "smoke_1",
      "fire_pillar",
      "lightning_bolt"
    ];

    for (const effect of particleEffects) {
      this.load.spritesheet(
        effect,
        `assets/spritesheets/particles/${effect}.png`,
        {
          frameWidth: 64,
          frameHeight: 64,
        }
      );
    }
  }

  loadParticleAnimations() {
    this.anims.create({
      key: "particle_impact",
      frames: this.anims.generateFrameNumbers("impact", {
        start: 0,
        end: 6,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "particle_whirlwind",
      frames: this.anims.generateFrameNumbers("whirlwind", {
        start: 0,
        end: 8,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "particle_smoke_1",
      frames: this.anims.generateFrameNumbers("smoke_1", {
        start: 0,
        end: 6,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "particle_fire_pillar",
      frames: this.anims.generateFrameNumbers("fire_pillar", {
        start: 0,
        end: 10,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "particle_lightning_bolt",
      frames: this.anims.generateFrameNumbers("fire_pillar", {
        start: 0,
        end: 6,
      }),
      frameRate: 12,
      repeat: 0,
    });
  }
}
