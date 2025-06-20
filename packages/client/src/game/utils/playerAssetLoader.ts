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
  [index: string]: { frames: number[]; frameRate?: number; repeat: number };
}

const animationFrames: AnimationFramesType = {
  idle: { frames: [1], repeat: -1 },
  walk: { frames: [0, 1, 2], frameRate: 5, repeat: -1 },
  crouch: { frames: [6], repeat: -1 },
  jumpRising: { frames: [7], repeat: 1 },
  jumpBalanced: { frames: [8], repeat: 1 },
  jumpFalling: { frames: [9], repeat: 1 },
  attack: { frames: [10, 11, 12, 13], frameRate: 9, repeat: 0 },
  dead: { frames: [22], frameRate: 1, repeat: 0 },
  bow: { frames: [15, 17], frameRate: 5, repeat: 0 },
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
            repeat: animationFrames[action].repeat,
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

export const loadSpriteAnimations = async (
  scene: Phaser.Scene,
  file: string
) => {
  const actions = Object.keys(animationFrames);

  directions.forEach((direction) => {
    actions.forEach((action) => {
      scene.anims.create({
        key: `player_${file}_${action}_${direction}`,
        frameRate: animationFrames[action].frameRate || 3,
        repeat: animationFrames[action].repeat,
        frames: scene.anims.generateFrameNames("player_" + file, {
          frames: animationFrames[action].frames.map(
            (x) => x + dirOffsets[direction]
          ),
        }),
      });
    });
  });
};
