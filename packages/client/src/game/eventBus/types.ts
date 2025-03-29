export interface SkillUIData {
    name: string;
}

export interface PlayerUIData {
  name: string;
  hp: number;
  maxHp: number;

  x: number;
  y: number;
  z: number;

  skills: (SkillUIData | null)[];
}
