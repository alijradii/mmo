import { eventBus } from "@/game/eventBus/eventBus";
import { InventoryItem } from "@backend/game/items/inventoryItem";
import { useEffect, useState } from "react";
import { InventorySlot } from "./inventory/inventory-slot";

export const GameHotbar: React.FC = () => {
  const [inventory, setInventory] = useState<(InventoryItem | null)[]>(
    Array(36).fill(null)
  );

  useEffect(() => {
    eventBus.on("update-inventory", (inv: (InventoryItem | null)[]) => {
      console.log("updated inventory");
      setInventory([...inv]);
    });
  }, []);

  return (
    <div
      className={`absolute bottom-4 right-4 rounded-lg overflow-hidden shadow-lg border 
        pointer-events-auto bg-background/90 grid grid-cols-3 gap-2 p-2`}
    >
      {inventory
        .slice(0, 6)
        .map((item: InventoryItem | null, index: number) => {
          return (
            <InventorySlot
              key={`inventory-${index}`}
              id={`inventory-${index}`}
              item={item}
            />
          );
        })}
    </div>
  );
};
