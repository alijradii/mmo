import { Entity } from "../../../../entities/entity";
import { StatusEffect } from "../../../statusEffects/statusEffect";
import { Feat } from "../../feat";

export class SuddenCharge extends Feat {
  constructor(entity: Entity) {
    super("Sudden Charge", entity);
  }

  effect() {
    const effect = new SuddenChargeStatusEffect();

    effect.initialize(this.entity);
  }
}

export class SuddenChargeStatusEffect extends StatusEffect {
  gainedSpeed = 0;
  constructor() {
    super("speed", 20 * 5);
  }

  onEnter() {
    this.gainedSpeed = this.entity.baseStats.SPEED;
    this.entity.finalStats.SPEED += this.gainedSpeed;
  }

  onExit(): void {
    this.entity.finalStats.SPEED -= this.gainedSpeed;
  }
}
