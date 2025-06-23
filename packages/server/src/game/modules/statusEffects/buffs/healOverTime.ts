import { StatusEffect } from "../statusEffect";

export class HealOverTimeStatusEffect extends StatusEffect {
  private amount: number = 0;
  constructor(remainingTicks: number, amount: number) {
    super("heal_over_time", remainingTicks);
    this.amount = amount;
  }

  effect(): void {
    this.entity.heal(this.amount);

    this.entity.world.broadcast("particle-damage", {
      x: this.entity.x,
      y: this.entity.y,
      value: this.amount,
      color: "green",
    });
  }
}
