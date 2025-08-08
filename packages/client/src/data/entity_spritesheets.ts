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
];
