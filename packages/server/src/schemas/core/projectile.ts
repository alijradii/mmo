import { GameRoom } from "../../rooms/gameRoom";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { GameObject } from "./gameObject";

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
}

export class Projectile extends GameObject {
  public lifespan = 0;
  public world: GameRoom;
  public attack: RangedAttack;

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

    this.id = this.world.state.entityIdCounter.toString();
    this.world.state.entityIdCounter++;

    this.world.state.projectiles.set(this.id, this);
  }

  update() {
    if (this.lifespan == 0) {
      this.destroy();
      return;
    }

    this.world.state.players.forEach((player) => {
      if (player === this.attack.entity) return;

      const hurtbox = player.getColliderRect();
      if (
        this.x >= hurtbox.x &&
        this.y >= hurtbox.y &&
        this.x <= hurtbox.x + hurtbox.width &&
        this.y <= hurtbox.y + hurtbox.height
      ) {
        this.attack.effect(player, this);
        this.destroy();
      }
    });

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
