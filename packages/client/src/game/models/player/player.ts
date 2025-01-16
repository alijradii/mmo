import { PlayerComponent } from "./playerComponent";
import { Player as PlayerSchema } from "@backend/schemas/player";
import { getDirectionFromVector } from "@/game//utils/vectors";

export class Player extends Phaser.GameObjects.Container {
  // body parts
  public frontExtra?: PlayerComponent;
  public backExtra?: PlayerComponent;
  public hair?: PlayerComponent;
  public backHair?: PlayerComponent;
  public hat?: PlayerComponent;
  public weapon?: PlayerComponent;

  public head: PlayerComponent;
  public top: PlayerComponent;
  public bottom: PlayerComponent;

  public direction: "up" | "down" | "left" | "right" = "down";
  public state: string;

  public activeCounter: number = 0;
  public lastAttackTick: number = 0;

  public schema: PlayerSchema;
  public isMainPlayer: boolean = false;

  public square: Phaser.GameObjects.Rectangle;
  public debug: boolean = false;

  constructor(
    scene: Phaser.Scene,
    schema: PlayerSchema,
    debug: boolean = false
  ) {
    super(scene);

    this.schema = schema;
    this.schema.onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("direction", this.schema.direction);
      this.setData("state", this.schema.state);
    });

    this.x = schema.x;
    this.y = schema.y;

    this.scene = scene;
    this.state = "walk";

    this.width = 48;
    this.height = 48;
    this.head = new PlayerComponent(this.scene, "player_head2", 0, 0, this);
    this.top = new PlayerComponent(this.scene, "player_top0", 0, 0, this);
    this.bottom = new PlayerComponent(this.scene, "player_bottom0", 0, 0, this);
    this.weapon = new PlayerComponent(this.scene, "player_sword1_c2", 0, 0, this);

    this.debug = debug;
    if (debug) this.square = this.scene.add.rectangle(0, 0, 32, 32, 0xff0000);
    else this.square = this.scene.add.rectangle(0, 0, 18, 26, 0x00ff00);
    this.square.setOrigin(0.5, 0.5);

    this.add(this.square);

    this.add(this.head);
    this.add(this.top);
    this.add(this.bottom);
    this.add(this.weapon);

    this.scene.add.existing(this);
  }

  play(key: string) {
    this.head.play(key, true);
    this.top.play(key, true);
    this.bottom.play(key, true);
    this.weapon?.play(key, true);
  }

  setDirection(
    direction: "up" | "down" | "left" | "right",
    force: boolean = false
  ) {
    if (this.direction == direction && !force) return;

    if (this.debug) {
      let xoffset = 0;
      let yoffset = 0;

      switch (direction) {
        case "up":
          [xoffset, yoffset] = [0, -11];
          break;
        case "down":
          [xoffset, yoffset] = [0, 6];
          break;
        case "left":
          [xoffset, yoffset] = [-6, 0];
          break;
        case "right":
          [xoffset, yoffset] = [11, 0];
      }

      this.square.x = xoffset;
      this.square.y = yoffset;
    }

    this.direction = direction;
    this.play(this.state);
  }

  setState(state: string | number): this {
    if (this.state === state) return this;

    super.setState(state);
    this.play(this.state);
    console.log("update state to", this.state);
    return this;
  }

  update() {
    if (!this.data) return;

    const { x, y, state, direction } = this.data.values;

    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;

    if ((dx !== 0 || dy !== 0) && this.state !== "attack") {
      const dir = getDirectionFromVector({ x: dx, y: dy });
      if ((dx === 0 && dy !== 0) || (dx !== 0 && dy === 0)) {
        this.setDirection(dir);
      }
      this.x = Phaser.Math.Linear(this.x, x, 0.4);
      this.y = Phaser.Math.Linear(this.y, y, 0.4);

      this.setState("walk");
      this.activeCounter = 2;
    }

    if (dx === 0 && dy === 0 && this.state === "walk") this.setState("idle");

    if (
      state === "attack" &&
      this.schema.lastAttackTick !== this.lastAttackTick
    ) {
      this.attack(direction);
    }
  }

  fixedUpdate() {
    if (this.activeCounter > 0) {
      this.activeCounter--;
    } else {
      // this.setState("idle");
    }
  }

  attack(direction: "up" | "down" | "left" | "right") {
    this.lastAttackTick = this.schema.lastAttackTick;
    this.setDirection(direction);
    this.setState("attack");

    this.head.on("animationcomplete", () => {
      this.activeCounter = 0;
      this.setState("idle");
    });
  }
}
