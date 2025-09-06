import { StatusEffect } from "../statusEffect";

interface Props {
  duration: number;
}

export class StrengthBuffStatusEffect extends StatusEffect {
  constructor({ duration }: Props) {
    super("strength_buff", duration, 100);
    this.priority = 10;
  }

  onEnter(): void {
    this.applyCondition();
  }

  onExit(): void {
    this.entity.resetFinalStats();
  }

  applyCondition(): void {
    this.entity.finalStats.STR += 3;
  }
}
