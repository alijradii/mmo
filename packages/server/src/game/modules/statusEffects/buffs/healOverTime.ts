import { StatusEffect } from "../statusEffect";

export class HealOverTimeStatusEffect extends StatusEffect {
  private amount: number = 0;
  constructor(remainingTicks: number, amount: number, interval: number = 1) {
    super("heal_over_time", remainingTicks, interval);
    this.amount = amount;
  }

  effect(): void {
    this.entity.heal(this.amount);
  }
}
