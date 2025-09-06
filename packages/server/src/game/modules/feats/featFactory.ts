import { Player } from "../../player/player";
import { AssassinateFeat } from "./classes/assassin/assassinate";
import { FanOfKnivesFeat } from "./classes/assassin/fanOfKnives";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { HealFeat } from "./classes/cleric/heal";
import { RegenerationFeat } from "./classes/cleric/regeneration";
import { SmiteFeat } from "./classes/cleric/smite";
import { FallingArrowFeat } from "./classes/ranger/fallingArrow";
import { ImpalingSpikeFeat } from "./classes/ranger/impalingSpike";
import { CleaveFeat } from "./classes/warrior/cleave";
import { DoubleSlash } from "./classes/warrior/double-slash";
import { EarthBreakFeat } from "./classes/warrior/earth-break";
import { PlaceHolder1Feat } from "./classes/warrior/placeholder-1";
import { PlaceHolder2Feat } from "./classes/warrior/placeholder-2";
import { SlashFeat } from "./classes/warrior/slash";
import { FireBallFeat } from "./classes/wizard/fireBall";
import { FireBurstFeat } from "./classes/wizard/fireBurst";
import { LightningStormFeat } from "./classes/wizard/lightningStorm";
import { Feat } from "./feat";

export const featFactory = (player: Player): Feat[] => {
  if (!player.iclass) return [];

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
    case "warrior":
      return [
        new SlashFeat(player),
        new CleaveFeat(player),
        new DoubleSlash(player),
        new PlaceHolder1Feat(player),
        new PlaceHolder2Feat(player),
        new EarthBreakFeat(player)
      ];
  }
  return [];
};
