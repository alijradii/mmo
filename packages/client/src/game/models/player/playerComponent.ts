import {Player} from "./player";

export class PlayerComponent extends Phaser.GameObjects.Sprite {
  public name: string;
  public player: Player;

  constructor(
    scene: Phaser.Scene,
    name: string,
    x: number,
    y: number,
    player: Player
  ) {
    super(scene, x, y, name, 1);
    this.player = player;
    this.name = name;
    this.scene.add.existing(this);
  }

  play(key: string, ignoreIfPlaying?: boolean): this {
    return super.play(
      `${this.name}_${key}_${this.player.direction}`,
      ignoreIfPlaying
    );
  }
}
