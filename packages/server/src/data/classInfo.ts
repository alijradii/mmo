import { Ability } from "../schemas/modules/abilityScores/abilityScores";

export class ClassInfo {
  description: string;
  hitpoints: number;
  keyAbilities: Ability[];
}
