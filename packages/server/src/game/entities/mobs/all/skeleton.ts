import { entity } from "@colyseus/schema";
import { Humanoid } from "../humanoid";
import { GameRoom } from "../../../../rooms/gameRoom";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";

const SKELETON_STATBLOCK: StatBlock = {
  STR: 16,
  DEX: 16,
  CHA: 4,
  CON: 12,
  INT: 8,
  WIS: 4,
  HP: 400,
};

@entity
export class Skeleton extends Humanoid {
  constructor(world: GameRoom, weapon: string = "") {
    super(
      world,
      HUMANOIDS_APPEARANCE.baseSkeleton,
      weapon || "rusty_sword",
      SKELETON_STATBLOCK,
    "assassin"
    );
  }
}
