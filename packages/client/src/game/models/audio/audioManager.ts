import { eventBus } from "@/game/eventBus/eventBus";
import Phaser from "phaser";

export class AudioManager {
  private scene: Phaser.Scene;
  private bgm?: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    eventBus.on("play-music", (message) => {
      this.playBGM(message.music, { volume: 0.3 }, () => {});
    });
  }

  /**
   * Play background music
   * @param key The audio key loaded in Phaser
   * @param config Optional Phaser sound config
   * @param onComplete Optional callback when the music finishes
   */
  public playBGM(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig,
    onComplete?: () => void
  ): void {
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }

    this.bgm = this.scene.sound.add(key, {
      loop: false,
      volume: 0.5,
      ...config,
    });

    this.bgm.once("complete", () => {
      if (onComplete) {
        onComplete();
      } else {
        this.playBGM(key, config);
      }
    });

    this.bgm.play();
  }

  public stopBGM(): void {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm = undefined;
    }
  }

  public pauseBGM(): void {
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.pause();
    }
  }

  public resumeBGM(): void {
    if (this.bgm && this.bgm.isPaused) {
      this.bgm.resume();
    }
  }

  public isPlaying(): boolean {
    return !!this.bgm?.isPlaying;
  }
}
