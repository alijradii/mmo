import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { Card } from "@/components/ui/card"
import { InventoryGrid } from "@/components/inventory/inventory-grid"
import { EquipmentSlots } from "@/components/inventory/equipment-slots"
import { Item, type ItemType } from "@/components/inventory/item"

export interface InventoryItem {
  id: string
  name: string
  type: ItemType
  icon: string
  description: string
}

// Define the inventory slot interface
export interface InventorySlot {
  id: string
  item: InventoryItem | null
}

export default function InventorySystem() {
  // Sample items for the inventory
  const initialItems: InventoryItem[] = [
    { id: "sword1", name: "Steel Sword", type: "weapon", icon: "⚔️", description: "A sharp steel sword" },
    { id: "helmet1", name: "Iron Helmet", type: "helmet", icon: "🪖", description: "Protects your head" },
    { id: "chest1", name: "Plate Armor", type: "chest", icon: "🛡️", description: "Heavy but protective" },
    { id: "legs1", name: "Chain Leggings", type: "legs", icon: "👖", description: "Flexible leg protection" },
    { id: "boots1", name: "Leather Boots", type: "boots", icon: "👢", description: "Light and comfortable" },
    { id: "shield1", name: "Wooden Shield", type: "offhand", icon: "🛡️", description: "Basic protection" },
    { id: "potion1", name: "Health Potion", type: "consumable", icon: "🧪", description: "Restores health" },
    { id: "gem1", name: "Ruby", type: "gem", icon: "💎", description: "Valuable gem" },
    { id: "scroll1", name: "Scroll of Wisdom", type: "scroll", icon: "📜", description: "Contains ancient knowledge" },
    { id: "food1", name: "Bread", type: "food", icon: "🍞", description: "Restores a small amount of health" },
  ]

  // Initialize the inventory grid (6x6)
  const initialInventory: InventorySlot[] = Array(36)
    .fill(null)
    .map((_, index) => ({
      id: `inventory-${index}`,
      item: index < initialItems.length ? initialItems[index] : null,
    }))

  // Initialize equipment slots
  const initialEquipment = {
    weapon: { id: "slot-weapon", item: null },
    helmet: { id: "slot-helmet", item: null },
    chest: { id: "slot-chest", item: null },
    legs: { id: "slot-legs", item: null },
    boots: { id: "slot-boots", item: null },
    offhand: { id: "slot-offhand", item: null },
  }

  // State for inventory and equipment
  const [inventory, setInventory] = useState<InventorySlot[]>(initialInventory)
  const [equipment, setEquipment] = useState(initialEquipment)
  const [activeItem, setActiveItem] = useState<InventoryItem | null>(null)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    // Find the item being dragged
    let draggedItem: InventoryItem | null = null

    // Check if it's from inventory
    const inventorySlot = inventory.find((slot) => slot.id === activeId)
    if (inventorySlot && inventorySlot.item) {
      draggedItem = inventorySlot.item
    }

    // Check if it's from equipment
    if (!draggedItem) {
      const equipmentType = Object.keys(equipment).find(
        (type) => equipment[type as keyof typeof equipment].id === activeId,
      ) as keyof typeof equipment | undefined

      if (equipmentType && equipment[equipmentType].item) {
        draggedItem = equipment[equipmentType].item
      }
    }

    setActiveItem(draggedItem)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveItem(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Skip if dropping onto the same slot
    if (activeId === overId) {
      setActiveItem(null)
      return
    }

    // Find the source item
    let sourceItem: InventoryItem | null = null
    let sourceSlot = ""

    // Check if source is from inventory
    const inventorySourceIndex = inventory.findIndex((slot) => slot.id === activeId)
    if (inventorySourceIndex !== -1 && inventory[inventorySourceIndex].item) {
      sourceItem = inventory[inventorySourceIndex].item
      sourceSlot = "inventory"
    }

    // Check if source is from equipment
    if (!sourceItem) {
      const equipmentType = Object.keys(equipment).find(
        (type) => equipment[type as keyof typeof equipment].id === activeId,
      ) as keyof typeof equipment | undefined

      if (equipmentType && equipment[equipmentType].item) {
        sourceItem = equipment[equipmentType].item
        sourceSlot = equipmentType
      }
    }

    if (!sourceItem) {
      setActiveItem(null)
      return
    }

    // Handle dropping into inventory
    const inventoryTargetIndex = inventory.findIndex((slot) => slot.id === overId)
    if (inventoryTargetIndex !== -1) {
      const newInventory = [...inventory]
      const targetItem = inventory[inventoryTargetIndex].item

      // If source is from inventory
      if (sourceSlot === "inventory") {
        const sourceIndex = inventory.findIndex((slot) => slot.id === activeId)
        newInventory[sourceIndex].item = targetItem
        newInventory[inventoryTargetIndex].item = sourceItem
      }
      // If source is from equipment
      else {
        const equipmentType = sourceSlot as keyof typeof equipment
        newInventory[inventoryTargetIndex].item = sourceItem
        setEquipment({
          ...equipment,
          [equipmentType]: {
            ...equipment[equipmentType],
            item: targetItem,
          },
        })
      }

      setInventory(newInventory)
      setActiveItem(null)
      return
    }

    // Handle dropping into equipment
    const equipmentType = Object.keys(equipment).find(
      (type) => equipment[type as keyof typeof equipment].id === overId,
    ) as keyof typeof equipment | undefined

    if (equipmentType) {
      // Check if the item type matches the equipment slot
      if (sourceItem.type !== equipmentType) {
        setActiveItem(null)
        return
      }

      const targetItem = equipment[equipmentType].item

      // If source is from inventory
      if (sourceSlot === "inventory") {
        const sourceIndex = inventory.findIndex((slot) => slot.id === activeId)
        const newInventory = [...inventory]
        newInventory[sourceIndex].item = targetItem
        setInventory(newInventory)
      }
      // If source is from equipment
      else {
        const sourceEquipmentType = sourceSlot as keyof typeof equipment
        setEquipment({
          ...equipment,
          [sourceEquipmentType]: {
            ...equipment[sourceEquipmentType],
            item: targetItem,
          },
        })
      }

      setEquipment({
        ...equipment,
        [equipmentType]: {
          ...equipment[equipmentType],
          item: sourceItem,
        },
      })
    }

    setActiveItem(null)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Card className="p-6 border-2 max-w-4xl w-full">
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
            <Item item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
