export interface SkillUIData {
    name: string;
    isReady: boolean;
    index: number;
    readyAt: number;
    cooldown: number;
}

export interface StatusEffectUIData {
  name: string;
  icon: string;
  endTime: number;
}

export interface PlayerUIData {
  name: string;
  hp: number;
  maxHp: number;

  x: number;
  y: number;
  z: number;
}
