import { Player } from "./player";

export class PlayerComponent extends Phaser.GameObjects.Sprite {
  public itemName: string;
  public name: string;
  public player!: Player;
  public category: string;

  constructor(scene: Phaser.Scene, name: string, category: string) {
    const yOffset = name === "fishing_pole"? -12: -8;
    super(scene, 0, yOffset, "player_" + name, 1);

    this.itemName = name;
    this.name = "player_" + name;
    this.category = category;
  }

  initialize(player: Player) {
    this.player = player;
    this.scene.add.existing(this);
  }

  play(key: string, ignoreIfPlaying?: boolean): this {
    if (this.name === "player_fishing_pole") {
      return super.play("fishing_pole_idle", ignoreIfPlaying);
    }

    return super.play(
      `${this.name}_${key}_${this.player.direction}`,
      ignoreIfPlaying
    );
  }
}
