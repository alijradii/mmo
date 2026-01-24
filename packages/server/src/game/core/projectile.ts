import { type } from "@colyseus/schema";
import { GameRoom } from "../../rooms/gameRoom";
import { RangedAttack } from "../modules/attackModule/rangedAttack";
import { weaponFeatureFactory } from "../modules/weapons/features/weaponFeatures";
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
  private homingStrength: number = 8; // Proportional navigation constant (higher = tighter curves)

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

  private findClosestEnemy(): { x: number; y: number } | null {
    const allTargets = [
      ...this.world.state.players.values(),
      ...this.world.state.entities.values(),
    ];

    let closestTarget: { x: number; y: number; dist2: number } | null = null;
    let minDist2 = Infinity;

    for (const target of allTargets) {
      if (
        target === this.attack.entity ||
        target.party === this.attack.entity.party ||
        target.HP <= 0
      ) {
        continue;
      }

      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist2 = dx * dx + dy * dy;

      if (dist2 < minDist2) {
        minDist2 = dist2;
        closestTarget = { x: target.x, y: target.y, dist2 };
      }
    }

    return closestTarget ? { x: closestTarget.x, y: closestTarget.y } : null;
  }

  private updateHoming() {
    // Find closest enemy
    const target = this.findClosestEnemy();

    if (!target) {
      // No target found, maintain current velocity
      return;
    }

    // Calculate line-of-sight vector
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.1) {
      // Very close to target, don't adjust
      return;
    }

    // Normalize line-of-sight vector
    const losX = dx / dist;
    const losY = dy / dist;

    // Current velocity direction
    const currentSpeed = Math.sqrt(
      this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity
    );

    if (currentSpeed < 0.1) {
      // No velocity, can't home
      return;
    }

    const currentDirX = this.xVelocity / currentSpeed;
    const currentDirY = this.yVelocity / currentSpeed;

    // Proportional Navigation: adjust velocity toward target
    // This creates smooth curves by blending current direction with target direction
    const dotProduct = currentDirX * losX + currentDirY * losY;

    // Calculate perpendicular component for smooth turning
    const perpX = losX - currentDirX * dotProduct;
    const perpY = losY - currentDirY * dotProduct;
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);

    if (perpLength > 0.01) {
      // Normalize perpendicular component
      const perpNormX = perpX / perpLength;
      const perpNormY = perpY / perpLength;

      // Apply proportional navigation: turn toward target
      // The homingStrength controls how aggressively it turns
      const turnRate = this.homingStrength * tickInterval;
      const turnX = perpNormX * turnRate * currentSpeed;
      const turnY = perpNormY * turnRate * currentSpeed;

      // Update velocity with smooth curve
      this.xVelocity += turnX;
      this.yVelocity += turnY;

      // Maintain speed (optional: can allow speed variation for more dynamic behavior)
      const newSpeed = Math.sqrt(
        this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity
      );
      if (newSpeed > 0.1) {
        const speedRatio = currentSpeed / newSpeed;
        this.xVelocity *= speedRatio;
        this.yVelocity *= speedRatio;
      }
    }
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

    // Update homing behavior if this projectile has the homing trait
    if (this.attack.weapon.traits.includes("homing")) {
      this.updateHoming();
    }

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
