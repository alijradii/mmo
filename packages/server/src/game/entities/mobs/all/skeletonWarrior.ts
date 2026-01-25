import { entity } from "@colyseus/schema";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { GameRoom } from "../../../../rooms/gameRoom";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";
import { CleaveFeat } from "../../../modules/feats/classes/warrior/cleave";
import { ToughAsNailsFeat } from "../../../modules/feats/classes/warrior/toughAsNails";
import { DashFeat } from "../../../modules/feats/generic/dash";
import { Humanoid } from "../humanoid";

const SKELETON_STATBLOCK: StatBlock = {
  STR: 16,
  DEX: 16,
  CHA: 4,
  CON: 12,
  INT: 8,
  WIS: 4,
  HP: 300,
};

@entity
export class SkeletonWarrior extends Humanoid {
  constructor(world: GameRoom, weapon: string = "") {
    super(
      world,
      HUMANOIDS_APPEARANCE.baseSkeleton,
      weapon || "skeleton_sword",
      SKELETON_STATBLOCK,
      ""
    );

    this.feats.push(new ToughAsNailsFeat(this));
    this.feats.push(new DashFeat(this));
    this.feats.push(new CleaveFeat(this));
  }
}
