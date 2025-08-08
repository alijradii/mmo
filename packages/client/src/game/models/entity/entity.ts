import { ENTITY_SPRITES, EntitySprite } from "@/data/entity_spritesheets";
import { BaseScene } from "@/game/scenes/base";
import { Entity as EntitySchema } from "@backend/game/entities/entity";
import { getStateCallbacks } from "colyseus.js";

export class Entity extends Phaser.GameObjects.Container {
  public schema: EntitySchema;
  public direction: "up" | "down" | "left" | "right" = "down";

  public state: string;
  public sprite!: Phaser.GameObjects.Sprite;

  public isPlayer: boolean;

  public lastAttackTick: number = 0;

  public HP: number = 0;
  public spriteName: string = "";
  public spriteInfo: EntitySprite | null = null;

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

      this.setData("xVelocity", this.schema.xVelocity);
      this.setData("yVelocity", this.schema.yVelocity);
      this.setData("HP", this.schema.HP);

      this.setData("direction", this.schema.direction);
    });

    this.scene.add.existing(this);
  }

  fixedUpdate() {}

  update() {
    if (!this.data) return;

    console.log(this.state);
    const { x, y, z, xVelocity, yVelocity, direction, HP } = this.data.values;

    const netSpeed = Math.abs(xVelocity) + Math.abs(yVelocity);

    let dx = x - this.x;
    let dy = y - this.y - (z || 0);
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    if (this.direction !== direction) this.setDirection(direction);

    this.x = Phaser.Math.Linear(this.x, x, 0.6);
    this.y = Phaser.Math.Linear(this.y, y - (z || 0), 0.6);

    this.depth = this.y + this.height / -2;

    if (
      netSpeed > 25 &&
      this.state !== "attack" &&
      this.spriteInfo?.available_animations.includes("walk")
    ) {
      this.setState("walk");
    }
    if (dx === 0 && dy === 0 && this.state === "walk" && netSpeed < 25) {
      this.setState("idle");
    }

    if (this.HP > HP) {
      this.HP = HP;
      const tintColor = 0x660000;
      this.sprite?.setTint(tintColor);

      this.scene.time.delayedCall(200, () => {
        this.sprite?.clearTint();
      });
    } else if (this.HP < HP) {
      this.HP = HP;
    }
  }

  initAppearance() {
    if (this.sprite) {
      this.sprite.destroy();
    }

    const sprite = this.schema.appearance.get("sprite");
    if (!sprite) return;

    this.spriteName = sprite;
    this.spriteInfo =
      ENTITY_SPRITES.find((k) => k.key === this.spriteName) || null;

    this.sprite = this.scene.add.sprite(0, 0, sprite, 0);
    this.add(this.sprite);

    this.play(this.state);
  }

  play(key: string) {
    if (!this.sprite) return;

    if (this.spriteInfo?.directions === 1) {
      this.sprite.play(`${this.schema.appearance.get("sprite")}_${key}`, true);
      return;
    }

    if (this.spriteInfo?.directions === 3) {
      if (this.schema.xVelocity < 0) this.sprite.setFlipX(true);
      else if (this.schema.xVelocity > 0) this.sprite.setFlipX(false);

      const dir: string =
        this.direction === "up" || this.direction === "down"
          ? this.direction
          : "side";

      console.log(`${this.schema.appearance.get("sprite")}_${key}_${dir}`);
      this.sprite.play(
        `${this.schema.appearance.get("sprite")}_${key}_${dir}`,
        true
      );
    }
  }

  setState(state: string | number, force: boolean = false): this {
    if (this.isPlayer) {
      super.setState(state);
      return this;
    }

    if (this.state === state && !force) return this;

    super.setState(state);
    this.play(this.state);

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
