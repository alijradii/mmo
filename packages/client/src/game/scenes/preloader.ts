import { ENTITY_SPRITES } from "@/data/entity_spritesheets";
import { dataStore } from "../models/dataStore";

interface ParticleConfig {
  name: string;
  frameCount: number;
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
  width?: number;
  height?: number;
}

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  private particleConfigs: ParticleConfig[] = [
    { name: "impact", frameCount: 6, frameRate: 12, repeat: 0 },
    { name: "whirlwind", frameCount: 8, frameRate: 12, repeat: 0 },
    { name: "fireball", frameCount: 5, frameRate: 5, repeat: -1 },
    { name: "smoke_1", frameCount: 6, frameRate: 12, repeat: 0 },
    { name: "fire_pillar", frameCount: 10, frameRate: 12, repeat: 0 },
    { name: "lightning_bolt", frameCount: 5, frameRate: 12, repeat: 1 },
    { name: "heal", frameCount: 13, frameRate: 12, repeat: 1 },
    { name: "holy_wings", frameCount: 8, frameRate: 12, repeat: 1 },
    { name: "holy_beam", frameCount: 9, frameRate: 12, repeat: 0 },
    { name: "heal_2", frameCount: 9, frameRate: 12, repeat: 0 },
    { name: "earth_fall_break", frameCount: 12, frameRate: 12, repeat: 0 },
    { name: "earth2", frameCount: 15, frameRate: 12, repeat: 0 },
    { name: "arrow_fall", frameCount: 11, frameRate: 12, repeat: 0 },
    { name: "ice_break", frameCount: 11, frameRate: 12, repeat: 0 },
    { name: "plant_spike", frameCount: 6, frameRate: 12, repeat: 0 },
    { name: "explosion1", frameCount: 10, frameRate: 12, repeat: 0 },
    { name: "explosion2", frameCount: 8, frameRate: 12, repeat: 0 },
    { name: "smoke1", frameCount: 6, frameRate: 12, repeat: 0 },
    {
      name: "warrior1",
      frameCount: 10,
      frameRate: 18,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "warrior2",
      frameCount: 9,
      frameRate: 18,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "warrior3",
      frameCount: 10,
      frameRate: 18,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "warrior4",
      frameCount: 7,
      frameRate: 18,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "warrior5",
      frameCount: 8,
      frameRate: 18,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "paladin_heal",
      frameCount: 10,
      frameRate: 12,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "paladin_justice_hammer",
      frameCount: 12,
      frameRate: 12,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "paladin_holy_shield",
      frameCount: 16,
      frameRate: 12,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "paladin_holy_swords",
      frameCount: 16,
      frameRate: 12,
      repeat: 0,
      width: 128,
      height: 128,
    },
    {
      name: "paladin_explosion",
      frameCount: 11,
      frameRate: 12,
      repeat: 0,
      width: 128,
      height: 128,
    },
  ];

  preload() {
    this.load.audio("happy-birthday", "assets/audio/happy-birthday.mp3");

    for (let i = 1; i <= 5; i++) {
      this.load.image(`music_note_${i}`, `assets/spritesheets/notes/${i}.png`);
    }

    this.load.image("tiles", "assets/data/tilemaps/master_everything.png");

    this.load.image("master2_tiles", "assets/data/tilemaps/master_2.png");

    this.load.image(
      "dungeon_tiles",
      "assets/data/tilemaps/master_cavesmines.png"
    );

    this.load.image(
      "castles_and_catacombs_tiles",
      "assets/data/tilemaps/castles_and_catacombs.png"
    );

    this.load.tilemapTiledJSON("map", "assets/data/tilemaps/prototype.json");
    this.load.tilemapTiledJSON(
      "overworld_map",
      "assets/data/tilemaps/overworld.json"
    );
    this.load.tilemapTiledJSON("dungeon_map", "assets/data/tilemaps/cave.json");
    this.load.tilemapTiledJSON(
      "castle_interior",
      "assets/data/tilemaps/castle.json"
    );

    this.load.spritesheet("arrow", "assets/spritesheets/misc/arrow.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("bullet", "assets/spritesheets/misc/bullet.png", {
      frameWidth: 10,
      frameHeight: 10,
    });

    this.load.spritesheet(
      "arrow_of_light",
      "assets/spritesheets/misc/arrow_of_light.png",
      {
        frameWidth: 12,
        frameHeight: 14,
      }
    );

    this.load.spritesheet(
      "player_fishing_pole",
      "assets/spritesheets/player/weapon/fishing_pole.png",
      {
        frameWidth: 80,
        frameHeight: 64,
      }
    );

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

    this.load.spritesheet("sphere_bomb", "assets/spritesheets/misc/sphere_bomb.png", {
      frameWidth: 30,
      frameHeight: 30,
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
    for (const entity of ENTITY_SPRITES) {
      if (entity.path) {
        this.load.spritesheet(entity.key, entity.path, {
          frameWidth: entity.frameWidth,
          frameHeight: entity.frameHeight,
        });
      }
    }
  }

  // Creating all entity animations
  loadEntityAnimations() {
    for (const entity of ENTITY_SPRITES) {
      if (entity.animations) {
        for (const anim of entity.animations) {
          this.anims.create({
            key: anim.key,
            frames: this.anims.generateFrameNumbers(entity.key, {
              start: anim.start,
              end: anim.end,
            }),
            frameRate: anim.frameRate,
            repeat: anim.repeat,
          });
        }
      }
    }
  }

  loadParticleSprites() {
    for (const config of this.particleConfigs) {
      this.load.spritesheet(
        config.name,
        `assets/spritesheets/particles/${config.name}.png`,
        {
          frameWidth: config.width || 64,
          frameHeight: config.height || 64,
        }
      );
    }
  }

  loadParticleAnimations() {
    for (const config of this.particleConfigs) {
      this.anims.create({
        key: `particle_${config.name}`,
        frames: this.anims.generateFrameNumbers(config.name, {
          start: 0,
          end: config.frameCount,
        }),
        frameRate: config.frameRate,
        yoyo: config.yoyo,
        repeat: config.repeat,
      });
    }
  }
}
