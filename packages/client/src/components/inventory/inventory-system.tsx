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
      setInventory([...inv]);
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

      const newInventory = [...inventory];
      newInventory[destIndex] = inventory[sourceIndex];
      newInventory[sourceIndex] = null;

      setInventory(newInventory);
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

      console.log("trying to move to slot: ", itemData.slot);
      // Check if item can be equipped in this slot
      if (itemData.type === "armor" || itemData.type === "weapon") {
        if (itemData.slot === destSlot) {
          const newInventory = [...inventory];
          const newEquipment = { ...equipment };

          // If there's already an item in the equipment slot, swap them
          if (equipment[destSlot]) {
            newInventory[sourceIndex] = equipment[destSlot];
          } else {
            newInventory[sourceIndex] = null;
          }

          newEquipment[destSlot] = item;

          setInventory(newInventory);
          setEquipment(newEquipment);
        }
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

      const item = equipment[sourceSlot];
      if (!item) return;

      const newInventory = [...inventory];
      const newEquipment = { ...equipment };

      // If there's already an item in the inventory slot, check if it can be equipped
      if (inventory[destIndex]) {
        const inventoryItem = inventory[destIndex];
        if (!inventoryItem) return;

        const itemData = dataStore.items.get(inventoryItem.id);

        if (!itemData) {
          throw new Error(`Inventory containing invalid item. id: ${item.id} `);
        }
        // If the inventory item can be equipped in this slot, swap them
        if (
          (itemData.type === "armor" || itemData.type === "weapon") &&
          itemData.slot === sourceSlot
        ) {
          newEquipment[sourceSlot] = inventoryItem;
        } else {
          return; // Can't swap if the inventory item can't be equipped
        }
      } else {
        newEquipment[sourceSlot] = null;
      }

      newInventory[destIndex] = item;

      setInventory(newInventory);
      setEquipment(newEquipment);
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
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Inventory</h2>
          <InventoryGrid inventory={inventory} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Equipment</h2>
          <EquipmentSlots equipment={equipment} />
        </div>
      </div>
    </DndContext>
  );
}
