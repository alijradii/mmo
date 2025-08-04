import { BaseScene } from "@/game/scenes/base";
import { GameObject as GameObjectSchema } from "@backend/game/core/gameObject";
import { getStateCallbacks } from "colyseus.js";
import { dataStore } from "../dataStore";

export class GameObject extends Phaser.GameObjects.Sprite {
  public schema: GameObjectSchema;
  private floatOffset = 0;
  private floatDirection = 1;

  constructor(scene: BaseScene, schema: GameObjectSchema) {
    super(scene, schema.x, schema.y, "__DUMMY__");

    this.schema = schema;
    const itemData = dataStore.items.get(schema.sprite);

    if (!itemData) {
      console.warn("Item data not found for:", schema.sprite);
      return;
    }

    const path = `./assets/gui/icons/${itemData.type}/${itemData.sprite}.png`;
    const spriteKey = itemData.sprite;

    const loadAndAdd = () => {
      this.setTexture(spriteKey);
      this.setFrame(0);
      this.scene.add.existing(this);
    };

    if (!scene.textures.exists(spriteKey)) {
      scene.load.spritesheet(spriteKey, path, {
        frameWidth: 48,
        frameHeight: 48,
      });

      scene.load.once("complete", () => {
        loadAndAdd();
      });

      scene.load.start();
    } else {
      loadAndAdd();
    }

    const $ = getStateCallbacks(scene.room);

    $(this.schema).onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("z", this.schema.z);
    });
  }

  fixedUpdate() {}

  update() {

    this.depth = this.y + this.height / -2;

    this.floatOffset += this.floatDirection * 0.025;
    if (this.floatOffset > 0.5 || this.floatOffset < -0.5)
      this.floatDirection *= -1;
    this.y = this.y + this.floatOffset;

    if (!this.data) return;

    const { x, y } = this.data.values;
    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    this.x = Phaser.Math.Linear(this.x, x, 0.6);
    this.y = Phaser.Math.Linear(this.y, y, 0.6);
  }
}
