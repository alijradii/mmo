import { BaseScene } from "@/game/scenes/base";
import { GameObject as GameObjectSchema} from "@backend/game/core/gameObject";
import { getStateCallbacks } from "colyseus.js";
import { dataStore } from "../dataStore";

export class GameObject extends Phaser.GameObjects.Sprite {
  public schema: GameObjectSchema;
  public sprite!: Phaser.GameObjects.Sprite;

  constructor(scene: BaseScene, schema: GameObjectSchema) {
    super(scene, schema.x, schema.y, schema.sprite);

    const itemData = dataStore.items.get(schema.sprite);

    const path = `./assets/gui/icons/${itemData?.type}/${itemData?.sprite}.png`;

    if(!scene.loadedSprites.has(path)) {
      scene.load.spritesheet(schema.sprite, path, {
        frameWidth: 48,
        frameHeight: 48
      })
    }

    this.setScale(0.5, 0.5);
    this.schema = schema;

    const $ = getStateCallbacks(scene.room);

    this.x = this.schema.x;
    this.y = this.schema.y;

    $(this.schema).onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("z", this.schema.z);
    });

    this.scene.add.existing(this);
  }

  fixedUpdate() {}

  update() {
    if (!this.data) return;

    this.depth = this.y + this.height / -2;

    const { x, y } = this.data.values;

    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    this.x = Phaser.Math.Linear(this.x, x, 0.6);
    this.y = Phaser.Math.Linear(this.y, y, 0.6);
  }
}
