import { eventBus } from "@/game/eventBus/eventBus";
import { BaseScene } from "@/game/scenes/base";
import { createConfetti } from "./confetti";

export class ParticleManager {
  private scene: BaseScene;

  constructor(scene: BaseScene) {
    this.scene = scene;
  }

  init() {
    this.initDamageListeners();
    this.initParticleListener();

    eventBus.on("happy-birthday", () => {
      createConfetti(3000);
    });
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

    this.scene.room.onMessage(
      "circle-spawn",
      ({ x, y, xRadius, yRadius, color, duration }) => {
        this.spawnCircularEffect({
          scene: this.scene,
          x,
          y,
          xRadius,
          yRadius,
          color,
          duration,
        });
      }
    );

    this.scene.room.onMessage(
      "music-spawn",
      ({ x, y, intensity, duration, spread }) => {
        this.emitMusicNotes(this.scene, x, y, intensity, spread, duration);
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

  spawnCircularEffect({
    scene,
    x,
    y,
    xRadius,
    yRadius,
    color,
    duration,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    xRadius: number;
    yRadius: number;
    color: number;
    duration: number;
  }) {
    // Create a graphics buffer large enough to hold the ellipse
    const width = xRadius * 2;
    const height = yRadius * 2;

    const g = scene.add.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);

    // Draw ellipse centered inside the texture bounds
    g.fillEllipse(xRadius, yRadius, width, height);

    // Generate a texture exactly the size of the ellipse
    const key = `ellipse-${Phaser.Math.RND.uuid()}`;
    g.generateTexture(key, width, height);
    g.destroy();

    // Place the image in the world, centered at (x, y)
    const img = scene.add.image(x, y, key).setOrigin(0.5);
    img.setBlendMode(Phaser.BlendModes.ADD);

    // Animate expansion + fade
    scene.tweens.add({
      targets: img,
      scale: 2,
      alpha: 0,
      duration,
      ease: "Cubic.easeOut",
      onComplete: () => img.destroy(),
    });
  }

  /**
   * Spawns floating music notes from a given position.
   *
   * @param scene - Phaser.Scene
   * @param x - spawn X
   * @param y - spawn Y
   * @param intensity - how many notes per second
   * @param spread - horizontal spread (± pixels from x)
   * @param duration - duration in ms to keep emitting
   */
  emitMusicNotes(
    scene: Phaser.Scene,
    x: number,
    y: number,
    intensity: number,
    spread: number,
    duration: number
  ) {
    const textures = Array.from({ length: 5 }, (_, i) => `music_note_${i + 1}`);

    const timer = scene.time.addEvent({
      delay: 1000 / intensity,
      repeat: Math.floor((duration / 1000) * intensity) - 1,
      callback: () => {
        const key = Phaser.Utils.Array.GetRandom(textures);

        const spawnX = x + Phaser.Math.Between(-spread, spread);
        const spawnY = y;

        const note = scene.add.image(spawnX, spawnY, key).setScale(0.5);
        note.setDepth(900000);
        note.setAlpha(0);

        scene.tweens.add({
          targets: note,
          y: spawnY - Phaser.Math.Between(40, 60),
          alpha: 1,
          duration: 1200,
          yoyo: false,
          onComplete: () => {
            scene.tweens.add({
              targets: note,
              alpha: 0,
              y: note.y - 5,
              duration: 1000,
              onComplete: () => note.destroy(),
            });
          },
        });
      },
    });

    scene.time.delayedCall(duration, () => {
      timer.remove();
    });
  }
}
