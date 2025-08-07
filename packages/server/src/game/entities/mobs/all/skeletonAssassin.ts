import { entity } from "@colyseus/schema";
import { Humanoid } from "../humanoid";
import { GameRoom } from "../../../../rooms/gameRoom";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";

const SKELETON_STATBLOCK: StatBlock = {
  STR: 22,
  DEX: 22,
  CHA: 4,
  CON: 16,
  INT: 8,
  WIS: 4,
  HP: 500,
};

@entity
export class SkeletonAssassin extends Humanoid {
  constructor(world: GameRoom, weapon: string = "") {
    super(
      world,
      HUMANOIDS_APPEARANCE.eliteSkeleton,
      weapon || "daggers",
      SKELETON_STATBLOCK,
      "assassin"
    );
  }
}
