import { entity } from "@colyseus/schema";
import { Humanoid } from "../humanoid";
import { GameRoom } from "../../../../rooms/gameRoom";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";

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
      weapon || "shortbow",
      SKELETON_STATBLOCK,
    ""
    );
  }
}
