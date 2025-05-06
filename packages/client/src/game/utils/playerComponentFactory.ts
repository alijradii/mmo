import { PlayerComponent } from "../models/player/playerComponent";
import { loadSpriteAnimations } from "./playerAssetLoader";

export class PlayerComponentFactory {
  scene: Phaser.Scene;
  loadedComponents: Set<string> = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async loadSprite(name: string, category: string): Promise<void> {
    if (!this.loadedComponents.has(name)) {
      await new Promise<void>((resolve, reject) => {
        const key = `player_${name}`;
        this.scene.load.spritesheet(
          key,
          `../assets/spritesheets/player/${category}/${name}.png`,
          { frameWidth: 48, frameHeight: 48 }
        );

        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
          this.loadedComponents.add(name);

          loadSpriteAnimations(this.scene, name);
          resolve();
        });

        this.scene.load.once(Phaser.Loader.Events.FILE_LOAD_ERROR, () => {
          reject(new Error(`Failed to load sprite: ${name}`));
        });

        this.scene.load.start();
      });
    }
  }

  async create(name: string, category: string): Promise<PlayerComponent> {
    await this.loadSprite(name, category);

    return new PlayerComponent(this.scene, name, category);
  }
}
