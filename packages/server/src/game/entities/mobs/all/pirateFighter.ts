import { entity } from "@colyseus/schema";
import { Humanoid } from "../humanoid";
import { GameRoom } from "../../../../rooms/gameRoom";
import { HUMANOIDS_APPEARANCE } from "../../../../data/mobs/humanoids";
import { StatBlock } from "../../../modules/abilityScores/abilityScores";

const statblock: StatBlock = {
  STR: 22,
  DEX: 22,
  CHA: 4,
  CON: 16,
  INT: 8,
  WIS: 4,
  HP: 500,
};

@entity
export class PirateFighter extends Humanoid {
  constructor(world: GameRoom, weapon: string = "") {
    super(
      world,
      HUMANOIDS_APPEARANCE.pirate2,
      weapon || "pirate_golden_sword",
      statblock,
      "assassin"
    );
  }
}
