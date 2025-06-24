import { Player } from "../../player/player";
import { AssassinateFeat } from "./classes/assassin/assassinate";
import { FanOfKnivesFeat } from "./classes/assassin/fanOfKnives";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { HealFeat } from "./classes/cleric/heal";
import { RegenerationFeat } from "./classes/cleric/regeneration";
import { SmiteFeat } from "./classes/cleric/smite";
import { FallingArrowFeat } from "./classes/ranger/fallingArrow";
import { ImpalingSpikeFeat } from "./classes/ranger/impalingSpike";
import { FireBallFeat } from "./classes/wizard/fireBall";
import { FireBurstFeat } from "./classes/wizard/fireBurst";
import { LightningStormFeat } from "./classes/wizard/lightningStorm";
import { Feat } from "./feat";

export const featFactory = (player: Player): Feat[] => {
  switch (player.iclass._id) {
    case "assassin":
      return [
        new ShadowStepFeat(player),
        new FanOfKnivesFeat(player),
        new AssassinateFeat(player),
      ];
    case "wizard":
      return [
        new LightningStormFeat(player),
        new FireBurstFeat(player),
        new FireBallFeat(player),
      ];
    case "cleric":
      return [
        new RegenerationFeat(player),
        new SmiteFeat(player),
        new HealFeat(player),
      ];
    case "ranger":
      return [new FallingArrowFeat(player), new ImpalingSpikeFeat(player)];
  }
  return [];
};
