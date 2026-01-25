import { entity } from "@colyseus/schema";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { GameRoom } from "../../../../rooms/gameRoom";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";
import { MultishotFeat } from "../../../modules/feats/classes/ranger/multishot";
import { DashFeat } from "../../../modules/feats/generic/dash";
import { Humanoid } from "../humanoid";

const SKELETON_STATBLOCK: StatBlock = {
  STR: 12,
  DEX: 20,
  CHA: 4,
  CON: 12,
  INT: 8,
  WIS: 4,
  HP: 200,
};

@entity
export class SkeletonArcher extends Humanoid {
  constructor(world: GameRoom, weapon: string = "") {
    super(
      world,
      HUMANOIDS_APPEARANCE.baseSkeleton,
      weapon || "skeleton_bow",
      SKELETON_STATBLOCK,
      ""
    );

    this.feats.push(new MultishotFeat(this));
    this.feats.push(new DashFeat(this));
  }
}
