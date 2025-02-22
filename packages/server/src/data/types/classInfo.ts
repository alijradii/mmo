import { Ability } from "../../schemas/modules/abilityScores/abilityScores";

export interface ClassInfo {
  description: string;
  hitpoints: number;
  keyAbilities: Ability[];
}
