import { Ability } from "../../game/modules/abilityScores/abilityScores";

export interface ClassInfo {
  description: string;
  hitpoints: number;
  keyAbilities: Ability[];
}
