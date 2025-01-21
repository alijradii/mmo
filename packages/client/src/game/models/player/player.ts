import { PlayerComponent } from "./playerComponent";
import { Player as PlayerSchema } from "@backend/schemas/player/player";

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

  constructor(scene: Phaser.Scene, schema: PlayerSchema) {
    super(scene);

    this.schema = schema;
    this.schema.onChange(() => {
      this.setData("x", this.schema.x);
      this.setData("y", this.schema.y);
      this.setData("xVelocity", this.schema.xVelocity);
      this.setData("yVelocity", this.schema.yVelocity);

      this.setData("direction", this.schema.direction);
      this.setData("tick", this.schema.tick)
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
    this.weapon = new PlayerComponent(
      this.scene,
      "player_sword1_c2",
      0,
      0,
      this
    );

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

    this.direction = direction;
    this.play(this.state);
  }

  setState(state: string | number, force: boolean = false): this {
    if (this.state === state && !force) return this;

    super.setState(state);
    this.play(this.state);
    console.log("update state to", this.state);
    return this;
  }

  update() {
    if (!this.data) return;
    
    const { x, y, xVelocity, yVelocity, state, tick , direction} = this.data.values;

    const netSpeed = Math.abs(xVelocity) + Math.abs(yVelocity);

    let dx = x - this.x;
    let dy = y - this.y;
    if (Math.abs(dx) < 0.1) dx = 0;
    if (Math.abs(dy) < 0.1) dy = 0;
    
    if(this.direction != direction)
      this.setDirection(direction)

    if (this.state !== "attack") {
      this.x = Phaser.Math.Linear(this.x, x, 0.6);
      this.y = Phaser.Math.Linear(this.y, y, 0.6);

      if (netSpeed > 25) this.setState("walk");
      this.activeCounter = 2;
    }

    if (state === "attack" && tick > this.lastAttackTick) {
      console.log("Entering attack stateeeeeeeeeeeee");
      this.setState("attack", true);
      this.head.on("animationcomplete", () => this.setState("idle"));
      this.lastAttackTick = tick;
    }

    if (dx === 0 && dy === 0 && this.state === "walk") {
      if (netSpeed < 25) this.setState("idle");
    }
  }

  fixedUpdate() {
  }
}
