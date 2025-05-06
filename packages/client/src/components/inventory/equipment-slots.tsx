import { InventorySlot } from "./inventory-slot"
import { InventoryItem } from "@backend/schemas/items/inventoryItem"

interface EquipmentSlotsProps {
  equipment: Record<string, InventoryItem | null>
}

export function EquipmentSlots({ equipment }: EquipmentSlotsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
      {/* Left - Offhand */}
      <div className="flex flex-col items-center mt-[-100px]">
        <span className="text-white">Offhand</span>
        <InventorySlot
          id="equipment-offhand"
          item={equipment["offhand"]}
          isEquipmentSlot
          equipmentType="offhand"
        />
      </div>

      {/* Center - Helmet, Chest, Legs, Boots */}
      <div className="flex flex-col items-center space-y-4">
        {["helmet", "chest", "legs", "boots"].map((slot) => (
          <div key={slot} className="flex flex-col items-center">
            <span className="text-white capitalize">{slot}</span>
            <InventorySlot
              id={`equipment-${slot}`}
              item={equipment[slot]}
              isEquipmentSlot
              equipmentType={slot}
            />
          </div>
        ))}
      </div>

      {/* Right - Weapon */}
      <div className="flex flex-col items-center mt-[-100px]">
        <span className="text-white">Weapon</span>
        <InventorySlot
          id="equipment-weapon"
          item={equipment["weapon"]}
          isEquipmentSlot
          equipmentType="weapon"
        />
      </div>
    </div>
  )
}
