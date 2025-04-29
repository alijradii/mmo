import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Item } from "@backend/database/models/item.model";
import { deleteItem, updateOrCreateItem } from "@/utils/fetchItems";
import { toast } from "@/hooks/use-toast";

interface ModifyItemProps {
  item?: Item;
  onChange?: () => void;
  onCancel?: () => void;
}

export const ModifyItem: React.FC<ModifyItemProps> = ({
  item,
  onChange,
  onCancel,
}) => {
  const [id, setId] = useState(item?._id || "");
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [rarity, setRarity] = useState(item?.rarity || "common");
  const [type, setType] = useState(item?.type || "crafting");
  const [maxStack, setMaxStack] = useState(item?.maxItemsPerStack || 1);

  const onDelete = () => {
    if (onChange) onChange();

    deleteItem(id)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully deleted item" });
        if (onChange) onChange();
        if (onCancel) onCancel();
      })
      .catch((err) => {
        toast({
          title: "Oops!",
          description: "Something went wrong",
        });

        console.log(err);
      });
  };

  const handleSave = () => {
    if (onChange) onChange();

    updateOrCreateItem({
      _id: id,
      name,
      description,
      rarity,
      type,
      maxItemsPerStack: maxStack,
    })
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully created item" });
      })
      .catch((err) => {
        toast({
          title: "Oops!",
          description: "Something went wrong",
        });

        console.log(err);
      });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold">{item ? "Edit Item" : "New Item"}</h2>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="id">Item Id</Label>
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="sword_of_truth"
            />
          </div>
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sword of Truth"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A legendary blade..."
            />
          </div>
          <div>
            <Label htmlFor="rarity">Rarity</Label>
            <Input
              id="rarity"
              value={rarity}
              onChange={(e) => {
                const value = e.target.value as Item["rarity"];
                setRarity(value);
              }}
              placeholder="common | rare | legendary..."
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => {
                const value = e.target.value as Item["type"];
                setType(value);
              }}
              placeholder="weapon | armor | consumable..."
            />
          </div>
          <div>
            <Label htmlFor="maxStack">Max Items Per Stack</Label>
            <Input
              id="maxStack"
              type="number"
              value={maxStack}
              onChange={(e) => setMaxStack(parseInt(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {item ? "Update Item" : "Add Item"}
            </Button>
            <Button variant={"destructive"} onClick={() => onDelete()}>
              Delete Item
            </Button>
            {onCancel && (
              <Button
                variant="outline"
                onClick={() => {
                  onCancel();
                  if (onChange) onChange();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
