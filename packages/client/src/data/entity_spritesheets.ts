export interface EntityAnimation {
  key: string;
  start: number;
  end: number;
  frameRate: number;
  repeat: number;
}

export interface EntitySprite {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  animations: EntityAnimation[];
  directions: number;
  available_animations: string[];
}

export const ENTITY_SPRITES: EntitySprite[] = [
  {
    key: "lanternphantom",
    path: "assets/spritesheets/entities/lanternphantom.png",
    frameWidth: 32,
    frameHeight: 32,
    available_animations: ["idle"],
    animations: [
      {
        key: "lanternphantom_idle",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 1,
  },
  {
    key: "wasp_big",
    path: "assets/spritesheets/entities/wasp_big.png",
    frameWidth: 48,
    frameHeight: 32,
    available_animations: ["idle"],
    animations: [
      {
        key: "wasp_big_idle",
        start: 0,
        end: 2,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 1,
  },
  {
    key: "wasp_small",
    path: "assets/spritesheets/entities/wasp_small.png",
    frameWidth: 48,
    frameHeight: 32,
    available_animations: ["idle"],
    animations: [
      {
        key: "wasp_small_idle",
        start: 0,
        end: 2,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 1,
  },
  {
    key: "bat",
    path: "assets/spritesheets/entities/bat.png",
    frameWidth: 32,
    frameHeight: 32,
    available_animations: ["idle"],
    animations: [
      {
        key: "bat_idle",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 1,
  },
  {
    key: "pet_fox",
    path: "assets/spritesheets/pets/pet-fox.png",
    frameWidth: 24,
    frameHeight: 32,
    available_animations: ["idle", "walk", "play"],
    animations: [
      {
        key: "pet_fox_idle_up",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_fox_idle_side",
        start: 16,
        end: 19,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_fox_idle_down",
        start: 32,
        end: 35,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_fox_walk_up",
        start: 7,
        end: 11,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_fox_walk_side",
        start: 23,
        end: 26,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_fox_walk_down",
        start: 39,
        end: 42,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 3,
  },
  {
    key: "pet_cat",
    path: "assets/spritesheets/pets/pet-cat.png",
    frameWidth: 24,
    frameHeight: 32,
    available_animations: ["idle", "walk", "play"],
    animations: [
      {
        key: "pet_cat_idle_up",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_cat_idle_side",
        start: 16,
        end: 19,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_cat_idle_down",
        start: 32,
        end: 35,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_cat_walk_up",
        start: 7,
        end: 11,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_cat_walk_side",
        start: 23,
        end: 26,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_cat_walk_down",
        start: 39,
        end: 42,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 3,
  },
  {
    key: "pet_dragon",
    path: "assets/spritesheets/pets/pet-dragon.png",
    frameWidth: 40,
    frameHeight: 40,
    available_animations: ["idle", "walk", "play"],
    animations: [
      {
        key: "pet_dragon_idle_up",
        start: 0,
        end: 2,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_idle_side",
        start: 10,
        end: 12,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_idle_down",
        start: 20,
        end: 22,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_walk_up",
        start: 3,
        end: 5,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_walk_side",
        start: 13,
        end: 15,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_walk_down",
        start: 23,
        end: 25,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_play_up",
        start: 6,
        end: 9,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_play_side",
        start: 16,
        end: 19,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dragon_play_down",
        start: 26,
        end: 29,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 3,
  },
  {
    key: "pet_plant",
    path: "assets/spritesheets/pets/pet-plant.png",
    frameWidth: 32,
    frameHeight: 32,
    available_animations: ["idle", "start", "glide", "play"],
    animations: [
      {
        key: "pet_plant_idle_up",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_plant_idle_side",
        start: 13,
        end: 16,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_plant_idle_down",
        start: 26,
        end: 29,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_plant_start_up",
        start: 4,
        end: 7,
        frameRate: 4,
        repeat: 0,
      },
      {
        key: "pet_plant_start_side",
        start: 17,
        end: 20,
        frameRate: 4,
        repeat: 0,
      },
      {
        key: "pet_plant_start_down",
        start: 30,
        end: 33,
        frameRate: 4,
        repeat: 0,
      },
      {
        key: "pet_plant_glide_up",
        start: 8,
        end: 9,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_plant_glide_side",
        start: 21,
        end: 22,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_plant_glide_down",
        start: 34,
        end: 35,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 3,
  },
  {
    key: "pet_dino",
    path: "assets/spritesheets/pets/pet-dino.png",
    frameWidth: 40,
    frameHeight: 32,
    available_animations: ["idle", "walk", "play"],
    animations: [
      {
        key: "pet_dino_idle_up",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dino_idle_side",
        start: 17,
        end: 20,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dino_idle_down",
        start: 34,
        end: 37,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dino_walk_up",
        start: 8,
        end: 11,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dino_walk_side",
        start: 25,
        end: 28,
        frameRate: 4,
        repeat: -1,
      },
      {
        key: "pet_dino_walk_down",
        start: 42,
        end: 45,
        frameRate: 4,
        repeat: -1,
      },
    ],
    directions: 3,
  },
];
