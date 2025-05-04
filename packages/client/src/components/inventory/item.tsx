import { useDraggable } from "@dnd-kit/core"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ItemType =
  | "weapon"
  | "helmet"
  | "chest"
  | "legs"
  | "boots"
  | "offhand"
  | "consumable"
  | "gem"
  | "scroll"
  | "food"

export interface ItemProps {
  item: {
    id: string
    name: string
    type: ItemType
    icon: string
    description: string
  }
  slotId?: string
}

export function Item({ item, slotId }: ItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: slotId || item.id,
    data: {
      item,
    },
  })

  // Get border color based on item type
  const getBorderColor = () => {
    switch (item.type) {
      case "weapon":
      case "offhand":
        return "border-red-600"
      case "helmet":
      case "chest":
      case "legs":
      case "boots":
        return "border-blue-600"
      case "consumable":
        return "border-green-600"
      case "gem":
        return "border-purple-600"
      case "scroll":
        return "border-yellow-600"
      default:
        return "border-gray-600"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`w-14 h-14 rounded border-2 ${getBorderColor()} flex items-center justify-center cursor-grab ${
              isDragging ? "opacity-50" : "opacity-100"
            }`}
            style={{
              touchAction: "none",
            }}
          >
            <div className="text-2xl">{item.icon}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="p-1">
            <p className="font-bold">{item.name}</p>
            <p className="text-xs">Type: {item.type}</p>
            <p className="text-xs">{item.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

