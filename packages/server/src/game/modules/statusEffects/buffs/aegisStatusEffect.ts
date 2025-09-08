import { StatusEffect } from "../statusEffect";

interface Props {
  duration: number;
}

export class AegisStatusEffect extends StatusEffect {
  constructor({ duration }: Props) {
    super("aegis", duration, 100);
    this.priority = 10;

    this.type = "buff";
    this.isImmune = true;
  }
}
