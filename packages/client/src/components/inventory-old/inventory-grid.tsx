import { useDroppable } from "@dnd-kit/core"
import { InventoryItem } from "@backend/schemas/items/inventoryItem"
import { ItemComponent} from "@/components/inventory-old/item-component"
import { dataStore } from "@/game/models/dataStore"

interface InventoryGridProps {
  slots: InventoryItem[]
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
  slot: InventoryItem
}

function InventorySlotComponent({ slot }: InventorySlotComponentProps) {
  const { setNodeRef } = useDroppable({
    id: slot.id,
  })

  const data = dataStore.items.get(slot.id)

  return (
    <div
      ref={setNodeRef}
      className="w-16 h-16 bg-slate-700 rounded-md border border-slate-600 flex items-center justify-center"
    >
      {data && <ItemComponent data={data} item={slot} />}
    </div>
  )
}
