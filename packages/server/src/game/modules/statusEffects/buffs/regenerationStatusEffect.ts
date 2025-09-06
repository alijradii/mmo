import { StatusEffect } from "../statusEffect";

interface HealOverTimeProps {
  duration: number;
  amount: number;
  interval?: number;
}

export class RegenerationStatusEffect extends StatusEffect {
  constructor({ duration, amount, interval = 1 }: HealOverTimeProps) {
    super("regeneration", duration, interval);
    this.amount = amount;
    this.maxStacks = 1;

    this.type = "buff";
  }

  effect(): void {
    this.entity.heal(this.amount);
  }
}
