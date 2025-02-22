export enum FeatType {
  General = "General",
  Class = "Class",
  Ancestry = "Ancestry",
  Skill = "Skill",
  Archetype = "Archetype",
}

export interface FeatRequirement {
  abilityScore?: { ability: string; min: number };
  otherFeat?: string[];
  classRequirement?: string[];
  levelRequirement?: number;
}

export interface FeatStatBlock {
  name: string;
  description: string;

  type: "PASSIVE" | "ACTIVE";
  tags: string[];

  prerequisites: FeatRequirement[];
  featType: FeatType;

  defaultCastTime: number;
}
