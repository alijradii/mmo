import { StatusEffect } from "../statusEffect";

interface Props {
  duration: number;
}

export class ImmobilizedCondition extends StatusEffect {
  constructor({ duration }: Props) {
    super("immobilized", duration, 100);
    this.priority = 100;
  }

  effect(): void {
    this.applyCondition();
  }

  onExit(): void {
    this.entity.resetFinalStats();
  }

  applyCondition(): void {
    this.entity.finalStats.SPEED = 0;
  }
}
