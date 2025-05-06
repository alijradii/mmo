import { Entity } from "../../../../entities/entity";
import { StatusEffect } from "../../../statusEffects/statusEffect";
import { Feat } from "../../feat";
import {entity} from "@colyseus/schema"

@entity
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
    this.gainedSpeed = Math.floor(this.entity.baseStats.SPEED / 3);
    this.entity.finalStats.SPEED += this.gainedSpeed;
  }

  onExit(): void {
    this.entity.finalStats.SPEED -= this.gainedSpeed;
  }
}
