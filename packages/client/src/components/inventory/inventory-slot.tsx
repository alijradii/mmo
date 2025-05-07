import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getRarityColor } from "@/lib/utils";
import { dataStore } from "@/game/models/dataStore";

import { InventoryItem } from "@backend/schemas/items/inventoryItem";

interface InventorySlotProps {
  id: string;
  item: InventoryItem | null;
  isEquipmentSlot?: boolean;
  equipmentType?: string;
}

export function InventorySlot({
  id,
  item,
  isEquipmentSlot = false,
  equipmentType,
}: InventorySlotProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setDroppableRef}
      className={`
        w-14 h-14 rounded-md flex items-center justify-center relative border
        ${isEquipmentSlot && equipmentType ? `equipment-${equipmentType}` : ""}
      `}
    >
      {item ? <DraggableItem id={id} item={item} /> : null}

      {isEquipmentSlot && (
        <div className="absolute bottom-0.5 right-0.5 text-xs text-gray-400">
          {equipmentType?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

interface DraggableItemProps {
  id: string;
  item: InventoryItem;
}

function DraggableItem({ id, item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const itemData = dataStore.items.get(item.id);
  if (!itemData) throw new Error(`Item data not found ${item.id}`);

  const rarityColor = getRarityColor(itemData.rarity);

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
      w-14 h-14 rounded flex items-center justify-center cursor-grab active:cursor-grabbing
      border-2 ${rarityColor}
    `}
    >
      <div className="relative w-full h-full p-2">
        <img
          src={`./assets/gui/icons/${itemData.type}/${itemData._id}.png`}
          className="w-full h-full object-contain"
          style={{
            imageRendering: "pixelated",
          }}
          alt={itemData._id}
        />
        {item.quantity > 1 && (
          <div className="text-xs text-white absolute bottom-0.5 right-1">
            {item.quantity}
          </div>
        )}
      </div>
    </div>
  );
}
