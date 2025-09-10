import { GameRoom } from "../../rooms/gameRoom";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { weaponFeatureFactory } from "../modules/weapons/features/weaponFeatures";
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

const gravityAcceleration = 12;

export class Projectile extends GameObject {
  public lifespan = 0;
  public world: GameRoom;
  public attack: RangedAttack;

  @type("string")
  name: string = "";

  @type("boolean")
  rigid = false;

  private hitTargets: Set<string> = new Set();

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

    if (this.attack.weapon.traits.includes("rigid")) this.rigid = true;
  }

  update() {
    if (this.lifespan <= 0) {
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
      ) {
        continue;
      }

      const hurtbox = target.getColliderRect();
      const width = this.name === "arrow" ? 0 : 8;

      const intersects =
        this.z <= 30 &&
        this.x >= hurtbox.x &&
        this.y - 8 + width >= hurtbox.y &&
        this.x <= hurtbox.x + hurtbox.width &&
        this.y - 8 - width <= hurtbox.y + hurtbox.height;

      if (intersects) {
        if (this.hitTargets.has(target.id)) {
          continue;
        }

        this.attack.effect(target, this);
        this.hitTargets.add(target.id);

        if (!this.attack.weapon.traits.includes("piercing")) {
          this.destroy();
          break;
        }
      }
    }

    this.lifespan--;

    this.x += this.xVelocity * tickInterval;
    this.y += this.yVelocity * tickInterval;

    if (this.rigid) this.updateGravity();
  }

  destroy() {
    if (this.attack.weapon.callback) {
      const callbackFunction = weaponFeatureFactory(
        this.attack.weapon.callback
      );

      callbackFunction({ x: this.x, y: this.y, entity: this.attack.entity });
    }
    this.world.state.projectiles.delete(this.id);
  }

  updateGravity() {
    if (this.z > 0 || this.zVelocity !== 0) {
      (this.zVelocity -= gravityAcceleration),
        (this.z += this.zVelocity * tickInterval);
    }

    if (this.z <= 0) {
      this.destroy();
    }
  }
}
