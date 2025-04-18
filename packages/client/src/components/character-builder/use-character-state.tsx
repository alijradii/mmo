"use client"

import { useState } from "react"

export interface AbilityPoints {
  STR: number
  DEX: number
  CON: number
  INT: number
  WIS: number
  CHA: number
}

export const useCharacterState = () => {
  const [selectedFeats, setSelectedFeats] = useState<string[]>([])
  const [abilityPoints, setAbilityPoints] = useState<AbilityPoints>({
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  })
  const [pointsRemaining, setPointsRemaining] = useState(10)

  return {
    selectedFeats,
    setSelectedFeats,
    abilityPoints,
    setAbilityPoints,
    pointsRemaining,
    setPointsRemaining,
  }
}
