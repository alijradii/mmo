import { GameRoom } from "../../rooms/gameRoom";
import { GameObject } from "./gameObject";

const tickInterval = 50;

interface ProjectileParams {
  x: number;
  y: number;
  z: number;
  xVelocity: number;
  yVelocity: number;
  zVelocity: number;
  world: GameRoom;
  lifespan: number;
}

export class Projectile extends GameObject {
  public lifespan = 0;
  public world: GameRoom;

  constructor({
    x,
    y,
    z,
    xVelocity,
    yVelocity,
    zVelocity,
    world,
    lifespan,
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

    this.id = this.world.state.entityIdCounter.toString();
    this.world.state.entityIdCounter++;

    this.world.state.projectiles.set(this.id, this);
  }

  update() {
    if (this.lifespan == 0) {
      this.destroy();
      return;
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
