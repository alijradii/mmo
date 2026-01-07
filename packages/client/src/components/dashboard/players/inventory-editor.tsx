import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { InventorySlot } from "@backend/database/models/player.model";
import { Item } from "@backend/database/models/item.model";
import { fetchItems } from "@/utils/fetchItems";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryEditorProps {
  inventoryGrid: InventorySlot[];
  gear: {
    weapon: InventorySlot | null;
    offhand: InventorySlot | null;
    helmet: InventorySlot | null;
    chest: InventorySlot | null;
    legs: InventorySlot | null;
    boots: InventorySlot | null;
  };
  onChange: (
    inventoryGrid: InventorySlot[],
    gear: {
      weapon: InventorySlot | null;
      offhand: InventorySlot | null;
      helmet: InventorySlot | null;
      chest: InventorySlot | null;
      legs: InventorySlot | null;
      boots: InventorySlot | null;
    }
  ) => void;
}

export const InventoryEditor: React.FC<InventoryEditorProps> = ({
  inventoryGrid,
  gear,
  onChange,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSlot, setEditingSlot] = useState<{
    type: "grid" | "gear";
    index?: number;
    slot?: keyof typeof gear;
  } | null>(null);

  useEffect(() => {
    fetchItems()
      .then((fetchedItems) => {
        setItems(fetchedItems);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch items:", error);
        setIsLoading(false);
      });
  }, []);

  const getItemById = (itemId: string | null): Item | undefined => {
    if (!itemId) return undefined;
    return items.find((item) => item._id === itemId);
  };

  const updateInventorySlot = (index: number, slot: InventorySlot) => {
    const newGrid = [...inventoryGrid];
    newGrid[index] = slot;
    onChange(newGrid, gear);
  };

  const updateGearSlot = (
    slotName: keyof typeof gear,
    slot: InventorySlot | null
  ) => {
    const newGear = { ...gear, [slotName]: slot };
    onChange(inventoryGrid, newGear);
  };

  const addItemToSlot = (itemId: string, quantity: number) => {
    if (editingSlot?.type === "grid" && editingSlot.index !== undefined) {
      updateInventorySlot(editingSlot.index, { itemId, quantity });
    } else if (editingSlot?.type === "gear" && editingSlot.slot) {
      updateGearSlot(editingSlot.slot, { itemId, quantity });
    }
    setEditingSlot(null);
  };

  const clearSlot = () => {
    if (editingSlot?.type === "grid" && editingSlot.index !== undefined) {
      updateInventorySlot(editingSlot.index, { itemId: null, quantity: 0 });
    } else if (editingSlot?.type === "gear" && editingSlot.slot) {
      updateGearSlot(editingSlot.slot, null);
    }
    setEditingSlot(null);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "uncommon":
        return "bg-green-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const InventorySlotDisplay = ({
    slot,
    onClick,
  }: {
    slot: InventorySlot;
    onClick: () => void;
  }) => {
    const item = getItemById(slot.itemId);

    return (
      <div
        className="relative border rounded p-2 h-16 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        {item ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span className="text-xs font-medium truncate max-w-[60px]">
                {item.name}
              </span>
            </div>
            <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>
              x{slot.quantity}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Empty</span>
        )}
      </div>
    );
  };

  const ItemSelector = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Select Item</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4">Loading items...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No items found
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    const quantity = prompt(
                      `Enter quantity for ${item.name}:`,
                      "1"
                    );
                    if (quantity) {
                      addItemToSlot(item._id, parseInt(quantity) || 1);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {item._id}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearSlot} className="flex-1">
            Clear Slot
          </Button>
          <Button
            variant="outline"
            onClick={() => setEditingSlot(null)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  const clearAllInventory = () => {
    if (!confirm("Are you sure you want to clear all inventory slots?")) {
      return;
    }
    const emptyGrid = Array(36).fill({ itemId: null, quantity: 0 });
    onChange(emptyGrid, gear);
  };

  const clearAllGear = () => {
    if (!confirm("Are you sure you want to clear all equipped gear?")) {
      return;
    }
    const emptyGear = {
      weapon: null,
      offhand: null,
      helmet: null,
      chest: null,
      legs: null,
      boots: null,
    };
    onChange(inventoryGrid, emptyGear);
  };

  const filledInventorySlots = inventoryGrid.filter(
    (slot) => slot.itemId !== null
  ).length;
  const filledGearSlots = Object.values(gear).filter(
    (slot) => slot !== null
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{filledInventorySlots} / 36</div>
              <div className="text-sm text-muted-foreground">
                Inventory Slots Used
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{filledGearSlots} / 6</div>
              <div className="text-sm text-muted-foreground">
                Gear Slots Equipped
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utility Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAllInventory}>
              Clear All Inventory
            </Button>
            <Button variant="outline" onClick={clearAllGear}>
              Clear All Gear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipped Gear */}
      <Card>
        <CardHeader>
          <CardTitle>Equipped Gear</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(
              ["weapon", "offhand", "helmet", "chest", "legs", "boots"] as const
            ).map((slotName) => {
              const slot = gear[slotName];
              const item = slot ? getItemById(slot.itemId) : null;

              return (
                <Dialog
                  key={slotName}
                  open={
                    editingSlot?.type === "gear" &&
                    editingSlot.slot === slotName
                  }
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingSlot({ type: "gear", slot: slotName });
                    } else {
                      setEditingSlot(null);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {slotName}
                    </Label>
                    <DialogTrigger asChild>
                      <div className="border rounded p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        {item && slot ? (
                          <div className="space-y-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Quantity: {slot.quantity}
                            </div>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            Empty slot
                          </div>
                        )}
                      </div>
                    </DialogTrigger>
                  </div>
                  <ItemSelector />
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Grid (36 slots)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {inventoryGrid.map((slot, index) => (
              <Dialog
                key={index}
                open={
                  editingSlot?.type === "grid" && editingSlot.index === index
                }
                onOpenChange={(open) => {
                  if (open) {
                    setEditingSlot({ type: "grid", index });
                  } else {
                    setEditingSlot(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <div>
                    <InventorySlotDisplay
                      slot={slot}
                      onClick={() =>
                        setEditingSlot({ type: "grid", index })
                      }
                    />
                  </div>
                </DialogTrigger>
                <ItemSelector />
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

