import { RegenerationStatusEffect } from "./buffs/regenerationStatusEffect";
import { MightStatusEffect } from "./buffs/mightStatusEffect";
import { ChilledCondition } from "./conditions/chilledCondition";
import { ImmobilizedCondition } from "./conditions/immobilizedCondition";
import { FallingArrowsStatusEffect } from "./feats/fallingArrows";
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
    // buffs
    case "regeneration":
      return new RegenerationStatusEffect({
        duration,
        interval,
        amount,
      });

    case "might":
      return new MightStatusEffect({
        duration,
        amount,
      });

    // debuffs and conditions
    case "chilled":
      return new ChilledCondition({
        duration,
      });

    case "immobilized":
      return new ImmobilizedCondition({
        duration,
      });

    // misc
    case "falling_arrows":
      return new FallingArrowsStatusEffect({
        duration,
        interval,
        amount,
      });
  }

  throw new Error(`status effect not found: ${name}`);
};
