import { WeaponStatBlock } from "../../../data/dataStore";
import { IWeapon } from "../../../database/models/weapon.model";
import {
  getDirectionFromVector,
  Vec2Normalize,
} from "../../../utils/math/vec2";
import { Entity } from "../../entities/entity";

export class Attack {
  name: string = "";
  attackType: "melee" | "ranged" | "magic" = "melee";
  entity: Entity;

  damage: number = 0;
  knockback: number = 0;
  cooldown: number = 0;
  lastUsed: number = 0;
  duration: number = 0;
  speed: number = 0;
  range: number = 0;

  weapon?: IWeapon;

  constructor(entity: Entity, weapon?: WeaponStatBlock, iweapon?: IWeapon) {
    this.entity = entity;
    this.weapon = iweapon;

    this.effect = this.effect.bind(this);
    this.filter = this.filter.bind(this);

    if (weapon) {
      this.damage = weapon.damage;
      this.duration = weapon.duration;
      this.cooldown = weapon.cooldown;
      this.attackType = weapon.type;
      this.speed = weapon.speed;
      this.knockback = weapon.knockback;
      this.range = weapon.range;
    }
  }

  isReady(tick: number): boolean {
    return tick > this.lastUsed + this.cooldown;
  }

  execute(tick: number): void {
    this.lastUsed = tick;
  }

  effect(entity: Entity) {
    if (!entity) return;
  }

  filter(entity: Entity) {
    return entity !== this.entity;
  }

  performAttack(defender: Entity) {
    const roll = diceRoll(20);
    // if weapon is a finesse weapon allow using DEX for attack roll
    const attackRollModifier =
      roll +
      (this.entity.bonuses.get("accuracy") || 0) +
      (this.weapon?.traits.includes("finesse")
        ? Math.max(this.entity.finalStats.DEX, this.entity.finalStats.STR)
        : this.entity.finalStats.STR);

    const targetAC =
      defender.finalStats.DEX +
      defender.finalStats.AC +
      (defender.bonuses.get("dodge") || 0);

    if (attackRollModifier < targetAC) {
      // missed the hit
      return;
    }

    let bonus: number =
      this.entity.bonuses.get(this.weapon?.damageType || "") || 0;
    let penalty: number =
      defender.resistances.get(this.weapon?.damageType || "") || 0;

    const baseDamage =
      bonus - penalty + (this.weapon?.damage || 8) * (roll === 20 ? 2 : 1);
    const randomizedDamage = randomizePercent(baseDamage, 20);

    defender.takeDamage(randomizedDamage);

    // handle knockback
    const dx = this.entity.x - defender.x;
    const dy = this.entity.y - defender.y;

    const normalizedVec = Vec2Normalize({ x: -dx, y: -dy });
    let knockbackPower =
      50 +
      (this.weapon?.attackForce || 50) *
        (this.entity.finalStats.STR, defender.finalStats.STR);

    defender.xVelocity = normalizedVec.x * knockbackPower;
    defender.yVelocity = normalizedVec.y * knockbackPower;

    const dir = getDirectionFromVector({ x: dx, y: dy });
    defender.direction = dir;
  }
}
