export type PlayerParts = {
  [part: string]: string[];
};

export const loadPlayerSprites = async (
  scene: Phaser.Scene,
  data: PlayerParts
) => {
  const keys = Object.keys(data);

  keys.forEach((key) => {
    const files = data[key];

    files.forEach((file) => {
      scene.load.spritesheet(
        "player_" + file,
        `../assets/spritesheets/player/${key}/${file}.png`,
        { frameWidth: 48, frameHeight: 48 }
      );
    });
  });
};

interface DirOffsetProps {
  up: number;
  left: number;
  right: number;
  down: number;
}

const dirOffsets: DirOffsetProps = {
  down: 0,
  left: 1 * 23,
  right: 2 * 23,
  up: 3 * 23,
};

interface AnimationFramesType {
  [index: string]: { frames: number[]; frameRate?: number; repeat?: number };
}

const animationFrames: AnimationFramesType = {
  idle: { frames: [1] },
  walk: { frames: [0, 1, 2], frameRate: 5 },
  crouch: { frames: [6] },
  jump: { frames: [7, 8, 9] },
  attack: { frames: [10, 11, 12, 13], frameRate: 5 },
};

const directions: ("up" | "down" | "left" | "right")[] = [
  "up",
  "down",
  "left",
  "right",
];

export const loadPlayerAnimations = async (
  scene: Phaser.Scene,
  data: PlayerParts
) => {
  const keys = Object.keys(data);

  const actions = Object.keys(animationFrames);

  keys.forEach((key) => {
    const files = data[key];

    files.forEach((file) => {
      const name = "player_" + file;

      directions.forEach((direction) => {
        actions.forEach((action) => {
          scene.anims.create({
            key: `player_${file}_${action}_${direction}`,
            frameRate: animationFrames[action].frameRate || 3,
            repeat: -1,
            // yoyo: true,
            frames: scene.anims.generateFrameNames(name, {
              frames: animationFrames[action].frames.map(
                (x) => x + dirOffsets[direction]
              ),
            }),
          });
        });
      });
    });
  });
};
