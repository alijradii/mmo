import { PlayerComponent } from "./playerComponent";

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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);

    this.x = x;
    this.y = y;

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
    this.add(this.weapon)
    this.scene.add.existing(this);
  }

  play(key: string) {
    this.head.play(key, true);
    this.top.play(key, true);
    this.bottom.play(key, true);
    this.weapon?.play(key, true)
  }

  setDirection(direction: string, force: boolean = false) {
    if (this.direction == direction && !force) return;

    this.direction = direction;
    this.play(this.state);
  }

  setState(state: string | number): this {
    if (this.state === state) return this;

    super.setState(state);
    this.play(this.state)
    console.log("update state to", this.state)
    return this;
  }
}
