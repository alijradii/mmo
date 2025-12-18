import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getRarityColor } from "@/lib/utils";
import { dataStore } from "@/game/models/dataStore";

import { InventoryItem } from "@backend/game/items/inventoryItem";
import { eventBus } from "@/game/eventBus/eventBus";

interface InventorySlotProps {
  index: number;
  id: string;
  item: InventoryItem | null;
  isEquipmentSlot?: boolean;
  equipmentType?: string;
  isHotBarItem?: boolean;
  isMobile?: boolean;
}

export function InventorySlot({
  id,
  item,
  index,
  isEquipmentSlot = false,
  isHotBarItem = false,
  equipmentType,
  isMobile = false,
}: InventorySlotProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const handleMouseDown = (mouseButton: number) => {
    if (!item) return;

    if (mouseButton === 2) {
      eventBus.emit("inventory-drop", { key: index });
    }

    if(mouseButton === 1 && isHotBarItem) {
      // trigger hotbar event
    }
  };

  return (
    <div
      ref={setDroppableRef}
      className={`
        ${isMobile ? "w-10 h-10" : "w-14 h-14"} rounded-md flex items-center justify-center relative border
        ${isEquipmentSlot && equipmentType ? `equipment-${equipmentType}` : ""}
      `}
    >
      {item ? (
        <div
          onMouseDown={(e) => {
            handleMouseDown(e.button);
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            // Prevent default to allow drag on mobile
            e.stopPropagation();
          }}
        >
          <DraggableItem id={id} item={item} isMobile={isMobile} />
        </div>
      ) : null}

      {isEquipmentSlot && !isMobile && (
        <div className={`absolute bottom-0.5 right-0.5 text-xs text-gray-400`}>
          {equipmentType?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

interface DraggableItemProps {
  id: string;
  item: InventoryItem;
  isMobile?: boolean;
}

function DraggableItem({ id, item, isMobile = false }: DraggableItemProps) {
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
      ${isMobile ? "w-10 h-10" : "w-14 h-14"} rounded flex items-center justify-center cursor-grab active:cursor-grabbing touch-none
      border-2 ${rarityColor}
    `}
    >
      <div className={`relative w-full h-full ${isMobile ? "p-1" : "p-2"}`}>
        <img
          src={`./assets/gui/icons/${itemData.type}/${itemData.sprite}.png`}
          className="w-full h-full object-contain"
          style={{
            imageRendering: "pixelated",
            transform: isMobile ? "scale(1.3)" : "scale(2)",
            transformOrigin: "center",
          }}
          alt={itemData._id}
        />
        {item.quantity > 1 && (
          <div className={`${isMobile ? "text-[9px]" : "text-xs"} text-white absolute bottom-0 right-0`}>
            {item.quantity}
          </div>
        )}
      </div>
    </div>
  );
}
