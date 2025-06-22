import { Ability } from "../../game/modules/abilityScores/abilityScores";

export interface Skill {
  keyAbility: Ability;
  untrainedActions: SkillAction[];
  trainedActions: SkillAction[];
}

export interface SkillAction {
  name: string;
}
