import { InventorySlot } from "./inventory-slot";
import { InventoryItem } from "@backend/game/items/inventoryItem";

interface InventoryGridProps {
  inventory: (InventoryItem | null)[];
  isMobile?: boolean;
}

export function InventoryGrid({ inventory, isMobile = false }: InventoryGridProps) {
  return (
    <div className={`grid ${isMobile ? "grid-cols-4 gap-1" : "grid-cols-6 gap-2"}`}>
      {inventory.map((item, index) => (
        <InventorySlot
          key={`inventory-${index}`}
          id={`inventory-${index}`}
          index={index}
          item={item}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
