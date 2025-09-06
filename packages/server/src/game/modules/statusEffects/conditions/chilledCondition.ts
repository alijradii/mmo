import { StatusEffect } from "../statusEffect";

interface Props {
  duration: number;
}

export class ChilledCondition extends StatusEffect {
  constructor({ duration }: Props) {
    super("chilled", duration, 100);
    this.priority = 10;
  }

  onEnter(): void {
      this.applyCondition();
  }

  onExit(): void {
    this.entity.resetFinalStats();
  }

  applyCondition(): void {
    this.entity.finalStats.SPEED = Math.floor(this.entity.baseStats.SPEED * 0.5);
  }
}
