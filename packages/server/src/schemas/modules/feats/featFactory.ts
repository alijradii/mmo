import { Player } from "../../player/player";
import { ShadowStepFeat } from "./classes/assassin/shadowstep";
import { Feat } from "./feat";

export const featFactory = (player: Player): Feat[] => {
  switch (player.iclass._id) {
    case "assassin":
      return [new ShadowStepFeat(player)];
  }
  return [];
};
