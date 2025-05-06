import { useDroppable } from "@dnd-kit/core";
import { ItemComponent } from "@/components/inventory-old/item-component";
import { InventoryItem } from "@backend/schemas/items/inventoryItem";
import { Item } from "@backend/database/models/item.model";
import { dataStore } from "@/game/models/dataStore";

interface EquipmentSlotsProps {
  equipment: {
    weapon: { item: InventoryItem; data: Item };
    helmet: { item: InventoryItem; data: Item };
    chest: { item: InventoryItem; data: Item };
    legs: { item: InventoryItem; data: Item };
    boots: { item: InventoryItem; data: Item };
    offhand: { item: InventoryItem; data: Item };
  };
}

export function EquipmentSlots({ equipment }: EquipmentSlotsProps) {
  return (
    <div className="flex flex-col gap-2">
      <EquipmentSlot
        data={dataStore.items.get(equipment.helmet.item.id)}
        slot={equipment.helmet.item}
        label="Helmet"
      />

      <div className="flex gap-2">
        <EquipmentSlot
          slot={equipment.weapon.item}
          label="Weapon"
          data={dataStore.items.get(equipment.weapon.item.id)}
        />
        <EquipmentSlot
          slot={equipment.chest.item}
          label="Chest"
          data={dataStore.items.get(equipment.chest.item.id)}
        />
        <EquipmentSlot
          slot={equipment.offhand.item}
          label="Offhand"
          data={dataStore.items.get(equipment.offhand.item.id)}
        />
      </div>

      <EquipmentSlot
        slot={equipment.legs.item}
        label="Legs"
        data={dataStore.items.get(equipment.legs.item.id)}
      />

      <EquipmentSlot
        slot={equipment.boots.item}
        label="Boots"
        data={dataStore.items.get(equipment.boots.item.id)}
      />
    </div>
  );
}

interface EquipmentSlotProps {
  label: string;
  data?: Item;
  slot: InventoryItem;
}

function EquipmentSlot({ data, slot, label }: EquipmentSlotProps) {
  const { setNodeRef } = useDroppable({
    id: slot.id,
  });

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-slate-400 mb-1">{label}</span>
      <div
        ref={setNodeRef}
        className="w-16 h-16 bg-slate-700 rounded-md border border-slate-600 flex items-center justify-center"
      >
        {slot && data ? (
          <ItemComponent data={data} item={slot} />
        ) : (
          <div className="w-8 h-8 opacity-30 relative"></div>
        )}
      </div>
    </div>
  );
}
