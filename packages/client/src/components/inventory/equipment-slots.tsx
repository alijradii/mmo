import { useDroppable } from "@dnd-kit/core"
import { Item } from "@/components/inventory/item"
import type { InventoryItem } from "@/components/inventory/inventory-system"
import { Sword, Shield, Shirt, Footprints } from "lucide-react"

interface EquipmentSlotsProps {
  equipment: {
    weapon: { id: string; item: InventoryItem | null }
    helmet: { id: string; item: InventoryItem | null }
    chest: { id: string; item: InventoryItem | null }
    legs: { id: string; item: InventoryItem | null }
    boots: { id: string; item: InventoryItem | null }
    offhand: { id: string; item: InventoryItem | null }
  }
}

export function EquipmentSlots({ equipment }: EquipmentSlotsProps) {
  return (
    <div className="flex flex-col gap-2">
      <EquipmentSlot
        id={equipment.helmet.id}
        item={equipment.helmet.item}
        label="Helmet"
        icon={<div className="text-slate-500">🪖</div>}
      />

      <div className="flex gap-2">
        <EquipmentSlot
          id={equipment.weapon.id}
          item={equipment.weapon.item}
          label="Weapon"
          icon={<Sword className="h-5 w-5 text-slate-500" />}
        />
        <EquipmentSlot
          id={equipment.chest.id}
          item={equipment.chest.item}
          label="Chest"
          icon={<Shirt className="h-5 w-5 text-slate-500" />}
        />
        <EquipmentSlot
          id={equipment.offhand.id}
          item={equipment.offhand.item}
          label="Offhand"
          icon={<Shield className="h-5 w-5 text-slate-500" />}
        />
      </div>

      <EquipmentSlot
        id={equipment.legs.id}
        item={equipment.legs.item}
        label="Legs"
        icon={<div className="text-slate-500">👖</div>}
      />

      <EquipmentSlot
        id={equipment.boots.id}
        item={equipment.boots.item}
        label="Boots"
        icon={<Footprints className="h-5 w-5 text-slate-500" />}
      />
    </div>
  )
}

interface EquipmentSlotProps {
  id: string
  item: InventoryItem | null
  label: string
  icon: React.ReactNode
}

function EquipmentSlot({ id, item, label, icon }: EquipmentSlotProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs mb-1">{label}</span>
      <div
        ref={setNodeRef}
        className="w-16 h-16 rounded-md border flex items-center justify-center"
      >
        {item ? <Item item={item} slotId={id} /> : icon}
      </div>
    </div>
  )
}
