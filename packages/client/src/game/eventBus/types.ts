export interface SkillUIData {
    name: string;
    isReady: boolean;
    index: number;
    readyAt: number;
    cooldown: number;
}

export interface PlayerUIData {
  name: string;
  hp: number;
  maxHp: number;

  x: number;
  y: number;
  z: number;
}
