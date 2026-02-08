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

export interface PartyMemberUIData {
  id: string;
  username: string;
  hp: number;
  maxHp: number;
}

export interface PartyInviteUIData {
  inviterId: string;
  inviterUsername: string;
  partyId: string;
  timestamp: number;
}
