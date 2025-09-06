import { StatusEffect } from "../statusEffect";

interface Props {
  amount: number
  duration: number;
}

export class MightStatusEffect extends StatusEffect {
  constructor({ duration , amount}: Props) {
    super("might", duration, 100);
    this.priority = 10;

    this.type = "buff";
    this.amount = amount;
  }

  onEnter(): void {
    this.applyCondition();
  }

  onExit(): void {
    this.entity.resetFinalStats();
  }

  applyCondition(): void {
    this.entity.finalStats.STR += this.amount;
  }
}
