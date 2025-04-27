import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchItems } from "@/utils/fetchItems";
import { useEffect, useState } from "react";
import { Item } from "@backend/database/models/item.model";
import { ModifyItem } from "./modify-item";
import { ItemDisplay } from "./display-item";

export const ItemsDashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems().then((_items: Item[]) => {
      setItems(_items);
    });
  }, []);

  const handleAddNewItem = () => {
    setAddingNewItem(true);
    setEditingItem(null);
  };

  const handleChange = () => {
    fetchItems().then((_items: Item[]) => {
      setItems(_items);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
        <CardDescription>A list of all the items in game.</CardDescription>
        <div className="mt-4">
          <Button onClick={handleAddNewItem}>New Item</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full space-y-4">
          {/* ModifyItem for adding or editing */}
          {(addingNewItem || editingItem) && (
            <ModifyItem
              item={editingItem ?? undefined} // Pass the item if editing
              onChange={() => handleChange()}
              onCancel={() => {
                setAddingNewItem(false);
                setEditingItem(null);
              }}
            />
          )}

          {/* List of items */}
          {!addingNewItem && !editingItem && (
            <div className="grid gap-4">
              {items.map((item) => (
                <ItemDisplay
                  key={item._id}
                  item={item}
                  onClick={() => {
                    setEditingItem(item);
                    setAddingNewItem(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
