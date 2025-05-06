import { useDraggable } from "@dnd-kit/core";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Item } from "@backend/database/models/item.model";
import { InventoryItem } from "@backend/schemas/items/inventoryItem";

export type ItemType =
  | "weapon"
  | "helmet"
  | "chest"
  | "offhand"
  | "boots"
  | "legs"
  | "consumable"
  | "material"
  | "crafting";

export interface ItemProps {
  data: Item;
  item: InventoryItem;
}

export function ItemComponent({ item, data }: ItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: {
      data,
    },
  });

  // Get border color based on item type
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`w-14 h-14 bg-slate-800 rounded border-2 flex items-center justify-center cursor-grab relative ${
              isDragging ? "opacity-50" : "opacity-100"
            }`}
            style={{
              touchAction: "none",
            }}
          >
            <div className="w-10 h-10 relative">
              <img
                src={`item.image`}
                alt={data.name}
                className="object-contain"
              />
            </div>

            {item.quantity > 1 && (
              <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-xs px-1 rounded-tl-md">
                {item.quantity}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="p-1">
            <p className="font-bold">{data.name}</p>
            <p className="text-xs text-slate-400">Type: {data.type}</p>
            <p className="text-xs">{data.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
