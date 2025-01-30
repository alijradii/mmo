import { Player } from "./player";

export class PlayerComponent extends Phaser.GameObjects.Sprite {
  public name: string;
  public player!: Player;

  constructor(scene: Phaser.Scene, name: string) {
    super(scene, 0, 0, "player_" +  name, 1);

    this.name = "player_" + name;
  }

  initialize(player: Player) {
    this.player = player;
    this.scene.add.existing(this);
  }

  play(key: string, ignoreIfPlaying?: boolean): this {
    console.log("is playing");
    return super.play(
      `${this.name}_${key}_${this.player.direction}`,
      ignoreIfPlaying
    );
  }
}
