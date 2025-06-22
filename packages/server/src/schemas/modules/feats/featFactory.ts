import { Player } from "../../player/player";
import { FanOfKnivesFeat } from "./classes/assassin/fan_of_knives";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { Feat } from "./feat";

export const featFactory = (player: Player): Feat[] => {
  switch (player.iclass._id) {
    case "assassin":
      return [new ShadowStepFeat(player), new FanOfKnivesFeat(player)];
  }
  return [];
};
