import { BaseScene } from "@/game/scenes/base";
import { Entity as EntitySchema } from "@backend/schemas/entities/entity";
import { getStateCallbacks } from "colyseus.js";

export class Entity extends Phaser.GameObjects.Container {
  public schema: EntitySchema;
  public direction: "up" | "down" | "left" | "right" = "down";

  public state: string;
  public sprite!: Phaser.GameObjects.Sprite;

  public isPlayer: boolean;

  public lastAttackTick: number = 0;

  constructor(scene: BaseScene, schema: EntitySchema, isPlayer?: boolean) {
    super(scene);
    this.schema = schema;
    this.state = "idle";

    this.isPlayer = isPlayer || false;
    if (isPlayer) return;

    const $ = getStateCallbacks(scene.room);

    const shadow = this.scene.add.circle(0, 0, 4, 0x000000);
    this.add(shadow);

    $(this.schema).listen("appearance", () => {
      this.initAppearance();
    });

    this.x = this.schema.x;
    this.y = this.schema.y;

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
  }

  initAppearance() {
    if (this.sprite) {
      this.sprite.destroy();
    }

    const sprite = this.schema.appearance.get("sprite");
    if (!sprite) return;

    this.sprite = this.scene.add.sprite(0, 0, sprite, 0);
    this.add(this.sprite);

    this.play(this.state);
  }

  play(key: string) {
    if (!this.sprite) return;

    this.sprite.play(`${this.schema.entityType}_${key}`, true);
  }

  setState(state: string | number, force: boolean = false): this {
    if(this.isPlayer) {
      super.setState(state);
      return this;
    }

    if (this.state === state && !force) return this;

    super.setState(state);
    this.play(this.state);

    this.direction = "up";
    this.setDirection("down");

    return this;
  }

  setDirection(
    direction: "up" | "down" | "left" | "right",
    force: boolean = false
  ) {
    if (this.direction == direction && !force) return;

    this.direction = direction;

    this.play(this.state);
  }
}
