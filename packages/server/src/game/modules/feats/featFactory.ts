import { Player } from "../../player/player";
import { AssassinateFeat } from "./classes/assassin/assassinate";
import { FanOfKnivesFeat } from "./classes/assassin/fan_of_knives";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { RegenerationFeat } from "./classes/cleric/regeneration";
import { FireBallFeat } from "./classes/wizard/fire_ball";
import { FireBurstFeat } from "./classes/wizard/fire_burst";
import { LightningStormFeat } from "./classes/wizard/lightning_storm";
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
      return [new RegenerationFeat(player)];
    case "ranger":
      return [];
  }
  return [];
};
