export interface Race {
  id: string
  name: string
  description: string
  bonuses: string
  icon: string
}

export const races: Race[] = [
  {
    id: "human",
    name: "Human",
    description: "Versatile and adaptable, humans receive bonuses to all abilities.",
    bonuses: "+1 to all ability scores",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "elf",
    name: "Elf",
    description: "Graceful and long-lived, elves excel at precision and magic.",
    bonuses: "+2 Dexterity, +1 Intelligence",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "dwarf",
    name: "Dwarf",
    description: "Sturdy and resilient, dwarves are masters of endurance.",
    bonuses: "+2 Constitution, +1 Strength",
    icon: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "orc",
    name: "Orc",
    description: "Powerful and intimidating, orcs are natural warriors.",
    bonuses: "+2 Strength, +1 Constitution",
    icon: "/placeholder.svg?height=64&width=64",
  },
]
