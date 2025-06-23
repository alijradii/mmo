import { StatusEffect } from "../statusEffect";

interface HealOverTimeProps {
  duration: number;
  amount: number;
  interval?: number;
}

export class HealOverTimeStatusEffect extends StatusEffect {
  constructor({ duration, amount, interval = 1 }: HealOverTimeProps) {
    super("heal_over_time", duration, interval);
    this.amount = amount;
  }

  effect(): void {
    this.entity.heal(this.amount);
  }
}
