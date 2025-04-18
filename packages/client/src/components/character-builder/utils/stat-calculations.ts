import type { AbilityPoints } from "../use-character-state"

export interface SecondaryStats {
  health: number
  mana: number
  criticalChance: number
  defense: number
  speed: number
  perception: number
  spellPower: number
  physicalPower: number
}

export const calculateSecondaryStats = (abilityPoints: AbilityPoints): SecondaryStats => {
  return {
    health: 100 + abilityPoints.constitution * 10,
    mana: 50 + abilityPoints.intelligence * 5 + abilityPoints.wisdom * 3,
    criticalChance: Math.min(5 + Math.floor(abilityPoints.dexterity / 4), 30),
    defense: 10 + Math.floor(abilityPoints.constitution / 2),
    speed: 30 + Math.floor(abilityPoints.dexterity / 3),
    perception: 10 + Math.floor(abilityPoints.wisdom / 2),
    spellPower: Math.floor((abilityPoints.intelligence + abilityPoints.wisdom) / 2),
    physicalPower: Math.floor((abilityPoints.strength + abilityPoints.dexterity) / 2),
  }
}
