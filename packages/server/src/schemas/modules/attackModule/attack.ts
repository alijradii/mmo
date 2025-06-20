import { IWeapon } from "../../../database/models/weapon.model";
import {
  getDirectionFromVector,
  Vec2Normalize,
} from "../../../utils/math/vec2";
import { diceRoll, randomizePercent } from "../../../utils/random";
import { Entity } from "../../entities/entity";
import { StunnedState } from "../../entities/genericStates/stunnedState";

export class Attack {
  name: string = "";
  attackType: "melee" | "ranged" | "magic" = "melee";
  entity: Entity;

  lastUsed: number = 0;
  weapon?: IWeapon;

  constructor(entity: Entity, iweapon?: IWeapon) {
    this.entity = entity;
    this.weapon = iweapon;

    this.effect = this.effect.bind(this);
    this.filter = this.filter.bind(this);
  }

  isReady(): boolean {
    return (
      this.entity.world.state.tick >
      this.lastUsed + (this.weapon?.attackSpeed || 20)
    );
  }

  execute(): void {
    this.lastUsed = this.entity.world.state.tick;
  }

  effect(entity: Entity) {
    if (!entity) return;
  }

  filter(entity: Entity) {
    return entity !== this.entity && this.entity.party !== entity.party;
  }

  performAttack(defender: Entity) {
    const roll = diceRoll(20);
    const isCritical = roll === 20;

    // if weapon is a finesse weapon allow using DEX for attack roll
    let attackRollModifier =
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
      // console.log("attack missed");
      return;
    }

    let bonus: number =
      this.entity.bonuses.get(this.weapon?.damageType || "") || 0;
    let penalty: number =
      defender.resistances.get(this.weapon?.damageType || "") || 0;

    let baseDamage = this.weapon?.damage || 5;

    if (!this.weapon?.ranged)
      baseDamage += (this.entity.finalStats.STR - 10) / 2;

    if (isCritical) baseDamage *= 2;
    baseDamage += bonus - penalty;

    const randomizedDamage = randomizePercent(baseDamage, 20);

    // console.log("damage: ", randomizedDamage);

    defender.takeDamage(randomizedDamage);

    // handle knockback
    const dx = this.entity.x - defender.x;
    const dy = this.entity.y - defender.y;

    const normalizedVec = Vec2Normalize({ x: -dx, y: -dy });
    let knockbackPower =
      (this.weapon?.attackForce || 0) *
      (this.entity.finalStats.STR / (defender.finalStats.STR || 1));

    if (this.weapon?.ranged) knockbackPower = 0;

    defender.setState(new StunnedState(defender, 7));

    defender.xVelocity = normalizedVec.x * knockbackPower;
    defender.yVelocity = normalizedVec.y * knockbackPower;

    const dir = getDirectionFromVector({ x: dx, y: dy });
    defender.direction = dir;

    this.entity.world.broadcast("particle-damage", {
      x: defender.x,
      y: defender.y,
      value: randomizedDamage,
      color: isCritical ? "orange" : "red",
    });
  }
}
