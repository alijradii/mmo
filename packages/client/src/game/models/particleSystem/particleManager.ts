import { BaseScene } from "@/game/scenes/base";

export class ParticleManager {
  private scene: BaseScene;

  constructor(scene: BaseScene) {
    this.scene = scene;
  }

  init() {
    this.initDamageListeners();
    this.initParticleListener();
  }

  initDamageListeners() {
    this.scene.room.onMessage(
      "particle-damage",
      ({
        x,
        y,
        value,
        color,
      }: {
        x: number;
        y: number;
        value: number;
        color: string;
      }) => {
        this.showDamageNumber(x, y, value, color);
      }
    );
  }

  /**
   * Displays damage number using digit images as floating particles.
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param value - Numeric value to display (e.g., 150)
   */
  public showDamageNumber(
    x: number,
    y: number,
    value: number,
    color: string
  ): void {
    const digits = value.toString().split("");
    const digitCount = digits.length;

    const spacing = 8; // horizontal spacing between digits
    const startX = x - (digitCount * spacing) / 2;

    digits.forEach((digit, index) => {
      const textureKey = `digit_${color}_${digit}`;
      const digitX = startX + index * spacing;

      const image = this.scene.add.image(digitX, y, textureKey);
      image.setDepth(100000); // Make sure it's on top

      this.scene.tweens.add({
        targets: image,
        y: y - 30,
        alpha: 0,
        duration: 1000,
        ease: "Cubic.easeOut",
        onComplete: () => image.destroy(),
      });
    });
  }

  initParticleListener() {
    this.scene.room.onMessage(
      "particle-spawn",
      ({ x, y, name }: { x: number; y: number; name: string }) => {
        this.spawnParticle(this.scene, x, y, name);
      }
    );
  }
  spawnParticle(scene: Phaser.Scene, x: number, y: number, name: string) {
    const sprite = scene.add.sprite(x, y, name);
    sprite.setOrigin(0.5);
    sprite.setDepth(100000);

    const animKey = `particle_${name}`;
    sprite.play(animKey);

    sprite.on("animationcomplete", () => {
      sprite.destroy();
    });
  }
}
