export interface Feat {
  id: string
  name: string
  description: string
  requirements: string
}

export const feats: Feat[] = [
  {
    id: "weapon_master",
    name: "Weapon Master",
    description: "Gain proficiency with four weapons of your choice.",
    requirements: "None",
  },
  {
    id: "alert",
    name: "Alert",
    description: "You can't be surprised and gain +5 to initiative.",
    requirements: "None",
  },
  {
    id: "dual_wielder",
    name: "Dual Wielder",
    description: "You can use two one-handed weapons and gain +1 to AC while doing so.",
    requirements: "Dexterity 13+",
  },
  {
    id: "elemental_adept",
    name: "Elemental Adept",
    description: "Your spells ignore resistance to a chosen damage type.",
    requirements: "Ability to cast at least one spell",
  },
  {
    id: "lucky",
    name: "Lucky",
    description: "Gain three luck points per day to reroll a d20.",
    requirements: "None",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Your speed increases by 10 feet and you can dash through difficult terrain.",
    requirements: "None",
  },
  {
    id: "resilient",
    name: "Resilient",
    description: "Gain proficiency in a saving throw of your choice.",
    requirements: "None",
  },
  {
    id: "tough",
    name: "Tough",
    description: "Your hit point maximum increases by an amount equal to twice your level.",
    requirements: "None",
  },
]
