import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { InventoryGrid } from "./inventory-grid";
import { EquipmentSlots } from "./equipment-slots";

import { dataStore } from "@/game/models/dataStore";
import { InventoryItem } from "../../../../server/src/schemas/items/inventoryItem";
import { eventBus } from "@/game/eventBus/eventBus";

export function InventorySystem() {
  const [inventory, setInventory] = useState<(InventoryItem | null)[]>(
    Array(36).fill(null)
  );

  useEffect(() => {
    eventBus.on("update-inventory", (inv: (InventoryItem | null)[]) => {
      console.log("updated inventory");
      setInventory([...inv]);
    });

    eventBus.on("update-equipment", (equip: Record<string, InventoryItem>) => {
      setEquipment(equip);
    });
  }, []);

  const [equipment, setEquipment] = useState<
    Record<string, InventoryItem | null>
  >({
    helmet: null,
    chest: null,
    legs: null,
    boots: null,
    weapon: null,
    offhand: null,
  });
  const [draggedItem, setDraggedItem] = useState<{
    item: InventoryItem;
    source: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sourceId = active.id as string;

    if (sourceId.startsWith("inventory-")) {
      const index = Number.parseInt(sourceId.replace("inventory-", ""));
      if (inventory[index]) {
        setDraggedItem({
          item: inventory[index] as InventoryItem,
          source: sourceId,
        });
      }
    } else if (sourceId.startsWith("equipment-")) {
      const slot = sourceId.replace("equipment-", "") as keyof typeof equipment;
      if (equipment[slot]) {
        setDraggedItem({
          item: equipment[slot] as InventoryItem,
          source: sourceId,
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !draggedItem) return;

    const sourceId = active.id as string;
    const destinationId = over.id as string;

    // Skip if dropped on the same slot
    if (sourceId === destinationId) {
      setDraggedItem(null);
      return;
    }

    // Handle inventory to inventory movement
    if (
      sourceId.startsWith("inventory-") &&
      destinationId.startsWith("inventory-")
    ) {
      const sourceIndex = Number.parseInt(sourceId.replace("inventory-", ""));
      const destIndex = Number.parseInt(
        destinationId.replace("inventory-", "")
      );
      eventBus.emit("inventory-move", {
        source: sourceIndex,
        destination: destIndex,
      });
    }

    // Handle inventory to equipment movement
    else if (
      sourceId.startsWith("inventory-") &&
      destinationId.startsWith("equipment-")
    ) {
      const sourceIndex = Number.parseInt(sourceId.replace("inventory-", ""));
      const destSlot = destinationId.replace(
        "equipment-",
        ""
      ) as keyof typeof equipment;

      const item = inventory[sourceIndex];
      if (!item) return;

      const itemData = dataStore.items.get(item.id);

      if (!itemData) {
        throw new Error(`Inventory containing invalid item. id: ${item.id} `);
      }

      // Check if item can be equipped in this slot
      if (
        itemData.type === "armor" ||
        (itemData.type === "weapon" && itemData.slot === destSlot)
      ) {
        eventBus.emit("inventory-equip", { source: sourceIndex });
      }
    }

    // Handle equipment to inventory movement
    else if (
      sourceId.startsWith("equipment-") &&
      destinationId.startsWith("inventory-")
    ) {
      const sourceSlot = sourceId.replace(
        "equipment-",
        ""
      ) as keyof typeof equipment;
      const destIndex = Number.parseInt(
        destinationId.replace("inventory-", "")
      );

      eventBus.emit("inventory-unequip", {
        key: sourceSlot,
        destination: destIndex,
      });
    }

    // Handle equipment to equipment movement (not allowed in this implementation)

    setDraggedItem(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start bg-background/90 backdrop-blur-sm border-2 rounded-2xl p-10 z-[99]">
        <div className="">
          <h2 className="text-xl font-bold text-white mb-4">Inventory</h2>
          <InventoryGrid inventory={inventory} />
        </div>

        <div className="">
          <h2 className="text-xl font-bold text-white mb-4">Equipment</h2>
          <EquipmentSlots equipment={equipment} />
        </div>
      </div>
    </DndContext>
  );
}
