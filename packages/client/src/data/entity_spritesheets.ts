export const ENTITY_SPRITES = [
  {
    key: "lanternphantom",
    path: "assets/spritesheets/entities/lanternphantom.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: [
      {
        key: "lanternphantom_idle",
        start: 0,
        end: 3,
        frameRate: 4,
        repeat: -1,
      },
    ],
  },
  {
    key: "wasp_big",
    path: "assets/spritesheets/entities/wasp_big.png",
    frameWidth: 48,
    frameHeight: 32,
    animations: [
      {
        key: "wasp_big_idle",
        start: 0,
        end: 2,
        frameRate: 4,
        repeat: -1,
      },
    ],
  },
  {
    key: "wasp_small",
    path: "assets/spritesheets/entities/wasp_small.png",
    frameWidth: 48,
    frameHeight: 32,
    animations: [
      {
        key: "wasp_small_idle",
        start: 0,
        end: 2,
        frameRate: 4,
        repeat: -1,
      },
    ],
  },
  {
    key: "player_fishing_pole",
    path: "assets/spritesheets/entities/player_fishing_pole.png", // if not needed, you can skip the path and loading
    frameWidth: 48,
    frameHeight: 48,
    animations: [
      {
        key: "fishing_pole_idle",
        start: 13,
        end: 13,
        frameRate: 2,
        repeat: 0,
      },
    ],
  },
];