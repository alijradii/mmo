import { Player } from "./player";

export class PlayerComponent extends Phaser.GameObjects.Sprite {
  public itemName: string;
  public name: string;
  public player!: Player;
  public category: string;

  constructor(scene: Phaser.Scene, name: string, category: string) {
    super(scene, 0, -8, "player_" +  name, 1);

    this.itemName = name;
    this.name = "player_" + name;
    this.category = category;
  }

  initialize(player: Player) {
    this.player = player;
    this.scene.add.existing(this);
  }

  play(key: string, ignoreIfPlaying?: boolean): this {
    return super.play(
      `${this.name}_${key}_${this.player.direction}`,
      ignoreIfPlaying
    );
  }
}
