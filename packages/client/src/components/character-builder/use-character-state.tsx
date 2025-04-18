"use client"

import { useState } from "react"

export interface AbilityPoints {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export const useCharacterState = () => {
  const [characterName, setCharacterName] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedRace, setSelectedRace] = useState("")
  const [selectedFeats, setSelectedFeats] = useState<string[]>([])
  const [abilityPoints, setAbilityPoints] = useState<AbilityPoints>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  })
  const [pointsRemaining, setPointsRemaining] = useState(10)

  return {
    characterName,
    setCharacterName,
    selectedClass,
    setSelectedClass,
    selectedRace,
    setSelectedRace,
    selectedFeats,
    setSelectedFeats,
    abilityPoints,
    setAbilityPoints,
    pointsRemaining,
    setPointsRemaining,
  }
}
