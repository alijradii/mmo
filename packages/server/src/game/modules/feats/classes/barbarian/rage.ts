import { Entity } from "../../../../entities/entity";
import { StatusEffect } from "../../../statusEffects/statusEffect";
import { Feat } from "../../feat";

export class RageFeat extends Feat {
  lastUsed: number = 0;
  constructor(entity: Entity) {
    super("Rage", entity);
  }

  effect() {
    this.lastUsed = performance.now();
    const rageEffect = new RageStatusEffect();

    rageEffect.initialize(this.entity);
  }

  isValid(): boolean {
    if (performance.now() - this.lastUsed < 60 * 1000) return false;

    return true;
  }
}

export class RageStatusEffect extends StatusEffect {
  gainedHP = 0;
  constructor() {
    super("rage", 20 * 60);
  }

  onEnter() {
    this.gainedHP = 2 * this.entity.LEVEL;

    this.entity.TEMP_HP += this.gainedHP;
    this.entity.finalStats.AC -= 1;
    this.entity.bonuses.meleeDamage += 2;
  }

  onExit(): void {
    this.entity.TEMP_HP = Math.max(this.entity.TEMP_HP - this.gainedHP, 0);
    this.entity.finalStats.AC += 1;
    this.entity.bonuses.meleeDamage -= 2;
  }
}
