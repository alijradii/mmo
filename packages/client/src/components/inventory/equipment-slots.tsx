import { InventorySlot } from "./inventory-slot"
import { InventoryItem } from "@backend/schemas/items/inventoryItem"

interface EquipmentSlotsProps {
  equipment: Record<string, InventoryItem | null>
}

export function EquipmentSlots({ equipment }: EquipmentSlotsProps) {
  const slots = [
    { id: "helmet", label: "Helmet" },
    { id: "chest", label: "Chest" },
    { id: "legs", label: "Legs" },
    { id: "boots", label: "Boots" },
    { id: "weapon", label: "Weapon" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      {slots.map((slot) => (
        <div key={slot.id} className="flex items-center">
          <span className="text-white w-20">{slot.label}:</span>
          <InventorySlot
            id={`equipment-${slot.id}`}
            item={equipment[slot.id]}
            isEquipmentSlot
            equipmentType={slot.id}
          />
        </div>
      ))}
    </div>
  )
}
