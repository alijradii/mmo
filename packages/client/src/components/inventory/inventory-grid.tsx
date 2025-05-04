import { useDroppable } from "@dnd-kit/core"
import { Item } from "@/components/inventory/item"
import type { InventorySlot } from "@/components/inventory/inventory-system"

interface InventoryGridProps {
  slots: InventorySlot[]
}

export function InventoryGrid({ slots }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {slots.map((slot) => (
        <InventorySlotComponent key={slot.id} slot={slot} />
      ))}
    </div>
  )
}

interface InventorySlotComponentProps {
  slot: InventorySlot
}

function InventorySlotComponent({ slot }: InventorySlotComponentProps) {
  const { setNodeRef } = useDroppable({
    id: slot.id,
  })

  return (
    <div
      ref={setNodeRef}
      className="w-16 h-16 rounded-md border flex items-center justify-center"
    >
      {slot.item && <Item item={slot.item} slotId={slot.id} />}
    </div>
  )
}
