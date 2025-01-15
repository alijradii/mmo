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

  public direction: string;
  public state: string;

  public activeCounter: number = 0;
  public lastAttackTick: number = 0;

  public schema: PlayerSchema;

  constructor(scene: Phaser.Scene, schema: PlayerSchema) {
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
    this.direction = "down";

    this.head = new PlayerComponent(this.scene, "player_head2", 0, 0, this);
    this.top = new PlayerComponent(this.scene, "player_top0", 0, 0, this);
    this.bottom = new PlayerComponent(this.scene, "player_bottom0", 0, 0, this);
    this.weapon = new PlayerComponent(this.scene, "player_axe1_c3", 0, 0, this);

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

  setDirection(direction: string, force: boolean = false) {
    if (this.direction == direction && !force) return;

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

    const { x, y, state } = this.data.values;

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

    if (state === "attack" && this.schema.lastAttackTick !== this.lastAttackTick) {
      this.lastAttackTick = this.schema.lastAttackTick;
      this.setState("attack");
      // this.activeCounter = 10;
      this.head.on("animationcomplete", () => {
        this.activeCounter = 0;
        this.setState("idle");
      });
    }
  }

  fixedUpdate() {
    if (this.activeCounter > 0) {
      this.activeCounter--;
    } else {
      // this.setState("idle");
    }
  }
}
