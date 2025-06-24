import { GameRoom } from "../../rooms/gameRoom";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { GameObject } from "./gameObject";
import { type } from "@colyseus/schema";

const tickInterval = 1 / 50;

interface ProjectileParams {
  x: number;
  y: number;
  z: number;
  xVelocity: number;
  yVelocity: number;
  zVelocity: number;
  world: GameRoom;
  lifespan: number;
  attack: RangedAttack;
  name: string;
}

export class Projectile extends GameObject {
  public lifespan = 0;
  public world: GameRoom;
  public attack: RangedAttack;

  @type("string")
  name: string = "";

  constructor({
    x,
    y,
    z,
    xVelocity,
    yVelocity,
    zVelocity,
    world,
    lifespan,
    attack,
    name,
  }: ProjectileParams) {
    super();

    this.x = x;
    this.y = y;
    this.z = z;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.zVelocity = zVelocity;
    this.world = world;
    this.lifespan = lifespan;
    this.attack = attack;
    this.name = name;

    this.id = this.world.state.entityIdCounter.toString();
    this.world.state.entityIdCounter++;

    this.world.state.projectiles.set(this.id, this);
  }

  update() {
    if (this.lifespan == 0) {
      this.destroy();
      return;
    }

    const allTargets = [
      ...this.world.state.players.values(),
      ...this.world.state.entities.values(),
    ];

    for (const target of allTargets) {
      if (
        target === this.attack.entity ||
        target.party === this.attack.entity.party
      )
        continue;

      const hurtbox = target.getColliderRect();

      const width = this.name === "arrow" ? 0 : 8;
      if (
        this.x >= hurtbox.x &&
        this.y - 8 + width >= hurtbox.y &&
        this.x <= hurtbox.x + hurtbox.width &&
        this.y - 8 - width <= hurtbox.y + hurtbox.height
      ) {
        this.attack.effect(target, this);
        this.destroy();
        // break;
      }
    }

    this.lifespan--;

    const dx = this.xVelocity * tickInterval;
    const dy = this.yVelocity * tickInterval;
    this.x += dx;
    this.y += dy;
  }

  destroy() {
    this.world.state.projectiles.delete(this.id);
  }
}
