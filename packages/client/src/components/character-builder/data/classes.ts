export interface ClassItem {
  id: string
  name: string
  description: string
  primaryStat: string
  icon: string
}

export const classes: ClassItem[] = [
  {
    id: "warrior",
    name: "Warrior",
    description: "Masters of combat who rely on physical strength and weapon skills.",
    primaryStat: "Strength",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "mage",
    name: "Mage",
    description: "Wielders of arcane magic who harness the elements and manipulate reality.",
    primaryStat: "Intelligence",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "rogue",
    name: "Rogue",
    description: "Stealthy operatives who excel at precision strikes and evasion.",
    primaryStat: "Dexterity",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "Divine spellcasters who heal allies and smite enemies with holy power.",
    primaryStat: "Wisdom",
    icon: "/placeholder.svg?height=64&width=64",
  },
]

export const getClassEquipment = (classId: string): string[] => {
  switch (classId) {
    case "warrior":
      return ["Longsword or Battleaxe", "Shield or Heavy Crossbow", "Chain Mail Armor", "Explorer's Pack"]
    case "mage":
      return ["Quarterstaff or Dagger", "Component Pouch or Arcane Focus", "Scholar's Pack", "Spellbook"]
    case "rogue":
      return ["Shortsword or Rapier", "Shortbow and Quiver", "Leather Armor", "Thieves' Tools"]
    case "cleric":
      return ["Mace or Warhammer", "Scale Mail or Leather Armor", "Light Crossbow and Bolts", "Holy Symbol"]
    default:
      return []
  }
}

export const getClassAbilities = (classId: string): string[] => {
  switch (classId) {
    case "warrior":
      return [
        "Second Wind: Recover hit points during battle",
        "Action Surge: Take an additional action",
        "Combat Style: Choose a specialized fighting technique",
      ]
    case "mage":
      return [
        "Arcane Recovery: Regain spell slots during a short rest",
        "Spellcasting: Cast powerful arcane spells",
        "Arcane Tradition: Specialize in a school of magic",
      ]
    case "rogue":
      return [
        "Sneak Attack: Deal extra damage when you have advantage",
        "Cunning Action: Take bonus actions to Dash, Disengage, or Hide",
        "Thieves' Cant: Speak in secret code with other rogues",
      ]
    case "cleric":
      return [
        "Divine Domain: Choose a deity and gain special powers",
        "Channel Divinity: Harness divine energy directly from your deity",
        "Spellcasting: Cast divine spells to heal and protect",
      ]
    default:
      return []
  }
}
