import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { InventoryGrid } from "@/components/inventory-old/inventory-grid";
import { EquipmentSlots } from "@/components/inventory-old/equipment-slots";
import { ItemComponent } from "@/components/inventory-old/item-component";
import { eventBus } from "@/game/eventBus/eventBus";
import { InventorySlot } from "@backend/database/models/player.model";

export default function InventorySystem() {
  // Initialize equipment slots
  const initialEquipment = {
    weapon: { id: "slot-weapon", item: null },
    helmet: { id: "slot-helmet", item: null },
    chest: { id: "slot-chest", item: null },
    legs: { id: "slot-legs", item: null },
    boots: { id: "slot-boots", item: null },
    offhand: { id: "slot-offhand", item: null },
  };

  // State for inventory and equipment
  const [inventory, setInventory] = useState<InventorySlot[]>(Array(36));
  const [equipment, setEquipment] = useState(initialEquipment);
  const [activeItem, setActiveItem] = useState<InventorySlot | null>(null);

  useEffect(() => {
    eventBus.on("update-inventory", (itemsList: InventorySlot[]) => {
      setInventory(itemsList);
    });
  }, []);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Find the item being dragged
    let draggedItem: InventorySlot | null = null;

    // Check if it's from inventory
    const inventorySlot = inventory.find((slot) => slot.id === activeId);
    if (inventorySlot && inventorySlot.item) {
      draggedItem = inventorySlot.item;
    }

    // Check if it's from equipment
    if (!draggedItem) {
      const equipmentType = Object.keys(equipment).find(
        (type) => equipment[type as keyof typeof equipment].id === activeId
      ) as keyof typeof equipment | undefined;

      if (equipmentType && equipment[equipmentType].item) {
        draggedItem = equipment[equipmentType].item;
      }
    }

    setActiveItem(draggedItem);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if dropping onto the same slot
    if (activeId === overId) {
      setActiveItem(null);
      return;
    }

    // Find the source item
    let sourceItem: InventoryItem | null = null;
    let sourceSlot = "";

    // Check if source is from inventory
    const inventorySourceIndex = inventory.findIndex(
      (slot) => slot.id === activeId
    );
    if (inventorySourceIndex !== -1 && inventory[inventorySourceIndex].item) {
      sourceItem = inventory[inventorySourceIndex].item;
      sourceSlot = "inventory";
    }

    // Check if source is from equipment
    if (!sourceItem) {
      const equipmentType = Object.keys(equipment).find(
        (type) => equipment[type as keyof typeof equipment].id === activeId
      ) as keyof typeof equipment | undefined;

      if (equipmentType && equipment[equipmentType].item) {
        sourceItem = equipment[equipmentType].item;
        sourceSlot = equipmentType;
      }
    }

    if (!sourceItem) {
      setActiveItem(null);
      return;
    }

    // Handle dropping into inventory
    const inventoryTargetIndex = inventory.findIndex(
      (slot) => slot.id === overId
    );
    if (inventoryTargetIndex !== -1) {
      const newInventory = [...inventory];
      const targetItem = inventory[inventoryTargetIndex].item;

      // If source is from inventory
      if (sourceSlot === "inventory") {
        const sourceIndex = inventory.findIndex((slot) => slot.id === activeId);
        const sourceQuantity = inventory[sourceIndex].quantity;

        // If same item type and both are stackable, combine quantities
        if (
          targetItem &&
          sourceItem &&
          targetItem.id === sourceItem.id &&
          targetItem.stackable
        ) {
          newInventory[inventoryTargetIndex].quantity += sourceQuantity;
          newInventory[sourceIndex].item = null;
          newInventory[sourceIndex].quantity = 0;
        } else {
          // Otherwise swap items and quantities
          newInventory[sourceIndex].item = targetItem;
          newInventory[sourceIndex].quantity =
            inventory[inventoryTargetIndex].quantity;
          newInventory[inventoryTargetIndex].item = sourceItem;
          newInventory[inventoryTargetIndex].quantity = sourceQuantity;
        }
      }
      // If source is from equipment
      else {
        const equipmentType = sourceSlot as keyof typeof equipment;

        newInventory[inventoryTargetIndex].item = sourceItem;
        // Equipment items always have quantity 1
        newInventory[inventoryTargetIndex].quantity = 1;

        setEquipment({
          ...equipment,
          [equipmentType]: {
            ...equipment[equipmentType],
            item: targetItem,
          },
        });
      }

      setInventory(newInventory);
      setActiveItem(null);
      return;
    }

    // Handle dropping into equipment
    const equipmentType = Object.keys(equipment).find(
      (type) => equipment[type as keyof typeof equipment].id === overId
    ) as keyof typeof equipment | undefined;

    if (equipmentType) {
      // Check if the item type matches the equipment slot
      if (sourceItem.type !== equipmentType) {
        setActiveItem(null);
        return;
      }

      const targetItem = equipment[equipmentType].item;

      // If source is from inventory
      if (sourceSlot === "inventory") {
        const sourceIndex = inventory.findIndex((slot) => slot.id === activeId);
        const newInventory = [...inventory];
        newInventory[sourceIndex].item = targetItem;
        setInventory(newInventory);
      }
      // If source is from equipment
      else {
        const sourceEquipmentType = sourceSlot as keyof typeof equipment;
        setEquipment({
          ...equipment,
          [sourceEquipmentType]: {
            ...equipment[sourceEquipmentType],
            item: targetItem,
          },
        });
      }

      setEquipment({
        ...equipment,
        [equipmentType]: {
          ...equipment[equipmentType],
          item: sourceItem,
        },
      });
    }

    setActiveItem(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className="p-6 bg-slate-800 border-slate-700 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-white">Inventory</h2>
            <InventoryGrid slots={inventory} />
          </div>
          <div className="w-full md:w-64">
            <h2 className="text-xl font-bold mb-4 text-white">Equipment</h2>
            <EquipmentSlots equipment={equipment} />
          </div>
        </div>
      </Card>

      <DragOverlay>
        {activeItem ? (
          <div className="transform-gpu scale-105">
            <ItemComponent
              item={activeItem}
              quantity={
                // Find the quantity from the source slot
                inventory.find((slot) => slot.item?.id === activeItem.id)
                  ?.quantity || 1
              }
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
