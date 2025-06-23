import { HealOverTimeStatusEffect } from "./buffs/healOverTime";
import { StatusEffect } from "./statusEffect";

interface StatusEffectFactoryProps {
  name: string;
  duration: number;
  amount?: number;
  interval?: number;
}

export const statusEffectFactory = ({
  name,
  duration,
  interval = 1000,
  amount = 5,
}: StatusEffectFactoryProps): StatusEffect => {
  switch (name) {
    case "heal_over_time":
      return new HealOverTimeStatusEffect({
        duration,
        interval,
        amount,
      });
  }

  throw new Error(`status effect not found: ${name}`);
};
