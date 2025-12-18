import { InventorySlot } from "./inventory-slot";
import { InventoryItem } from "@backend/game/items/inventoryItem";

interface EquipmentSlotsProps {
  equipment: Record<string, InventoryItem | null>;
  isMobile?: boolean;
}

export function EquipmentSlots({ equipment, isMobile = false }: EquipmentSlotsProps) {
  return (
    <div className={`grid grid-cols-3 ${isMobile ? "gap-1" : "gap-4"} items-center justify-items-center`}>
      {/* Left - Offhand */}
      <div className={`flex flex-col items-center ${isMobile ? "mt-[-30px]" : "mt-[-100px]"}`}>
        <span className={`text-white ${isMobile ? "text-[10px]" : "text-sm"}`}>Off</span>
        <InventorySlot
          index={-1}
          id="equipment-offhand"
          item={equipment["offhand"]}
          isEquipmentSlot
          equipmentType="offhand"
          isMobile={isMobile}
        />
      </div>

      {/* Center - Helmet, Chest, Legs, Boots */}
      <div className={`flex flex-col items-center ${isMobile ? "space-y-1" : "space-y-4"}`}>
        {["helmet", "chest", "legs", "boots"].map((slot) => (
          <div key={slot} className="flex flex-col items-center">
            <span className={`text-white capitalize ${isMobile ? "text-[10px]" : "text-sm"}`}>
              {isMobile ? slot.charAt(0).toUpperCase() : slot}
            </span>
            <InventorySlot
              index={-1}
              id={`equipment-${slot}`}
              item={equipment[slot]}
              isEquipmentSlot
              equipmentType={slot}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>

      {/* Right - Weapon */}
      <div className={`flex flex-col items-center ${isMobile ? "mt-[-30px]" : "mt-[-100px]"}`}>
        <span className={`text-white ${isMobile ? "text-[10px]" : "text-sm"}`}>Wpn</span>
        <InventorySlot
          index={-1}
          id="equipment-weapon"
          item={equipment["weapon"]}
          isEquipmentSlot
          equipmentType="weapon"
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
