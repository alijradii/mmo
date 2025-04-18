import { IPlayer } from "@backend/database/models/player.model";

export interface SecondaryStats {
  health: number;
  mana: number;
  criticalChance: number;
  defense: number;
  speed: number;
  perception: number;
  spellPower: number;
  physicalPower: number;
}

export const calculateSecondaryStats = (
  userData: IPlayer | null
): SecondaryStats => {
  if (!userData) {
    return {
      health: 0,
      mana: 0,
      criticalChance: 0,
      defense: 0,
      perception: 0,
      physicalPower: 0,
      speed: 0,
      spellPower: 0,
    };
  }
  return {
    health: 100 + userData.CON * 10,
    mana: 50 + userData.INT * 5 + userData.WIS * 3,
    criticalChance: Math.min(5 + Math.floor(userData.DEX / 4), 30),
    defense: 10 + Math.floor(userData.CON / 2),
    speed: 30 + Math.floor(userData.DEX / 3),
    perception: 10 + Math.floor(userData.WIS / 2),
    spellPower: Math.floor(
      (userData.INT + userData.WIS) / 2
    ),
    physicalPower: Math.floor(
      (userData.STR + userData.DEX) / 2
    ),
  };
};
