import { BaseScene } from "@/game/scenes/base";
import { Entity as EntitySchema } from "@backend/schemas/entities/entity";
import { getStateCallbacks } from "colyseus.js";

export class Entity extends Phaser.GameObjects.Container {
  public schema: EntitySchema;
  public direction: "up" | "down" | "left" | "right" = "down";

  constructor(scene: BaseScene, schema: EntitySchema) {
    super(scene);

    this.schema = schema;

    const $ = getStateCallbacks(scene.room);

    const shadow = this.scene.add.circle(0, 0, 4, 0x000000);
    this.add(shadow);

    $(this.schema).onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("z", this.schema.z);

      this.setData("direction", this.schema.direction);
    });

    this.scene.add.existing(this);
  }

  fixedUpdate() {}

  update() {
    if (!this.data) return;

    this.depth = this.y + this.height / -2;

    const { x, y, direction } = this.data.values;

    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    if (this.direction != direction) this.setDirection(direction);

    this.x = Phaser.Math.Linear(this.x, x, 0.6);
    this.y = Phaser.Math.Linear(this.y, y, 0.6);

    console.log(this.x, this.y)
  }

  setDirection(direction: "up" | "down" | "left" | "right") {
    console.log(direction);
  }
}
