import { InventorySlot } from "./inventory-slot";
import { InventoryItem } from "@backend/game/items/inventoryItem";

interface InventoryGridProps {
  inventory: (InventoryItem | null)[];
}

export function InventoryGrid({ inventory }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {inventory.map((item, index) => (
        <InventorySlot
          key={`inventory-${index}`}
          id={`inventory-${index}`}
          index={index}
          item={item}
        />
      ))}
    </div>
  );
}
