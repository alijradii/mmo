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
import { DoubleSlash } from "./classes/warrior/doubleSlash";
import { EarthBreakFeat } from "./classes/warrior/ earthBreak";
import { PlaceHolder1Feat } from "./classes/warrior/placeholder-1";
import { PlaceHolder2Feat } from "./classes/warrior/placeholder-2";
import { SecondWind } from "./classes/warrior/secondWind";
import { SlashFeat } from "./classes/warrior/slash";
import { ToughAsNailsFeat } from "./classes/warrior/toughAsNails";
import { FireBallFeat } from "./classes/wizard/fireBall";
import { FireBurstFeat } from "./classes/wizard/fireBurst";
import { LightningStormFeat } from "./classes/wizard/lightningStorm";
import { Feat } from "./feat";
import { BattleCry } from "./classes/warrior/battleCry";

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
        new EarthBreakFeat(player),
        new RegenerationFeat(player),
        new ToughAsNailsFeat(player),
        new SecondWind(player),
        new BattleCry(player)
      ];
  }
  return [];
};
