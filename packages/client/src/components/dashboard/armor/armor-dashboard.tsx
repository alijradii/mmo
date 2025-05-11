import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArmorForm } from "./armor-form";
import { ItemDisplay } from "./armor-display";
import { IArmor } from "@backend/database/models/armor.model";
import { fetchArmor } from "@/utils/fetchArmorData";

export const ArmorDashboard: React.FC = () => {
  const [armors, setArmors] = useState<IArmor[]>([]);
  const [addingNewItem, setAddingNewItem] = useState(false);

  const [editingItem, setEditingItem] = useState<IArmor | null>(null);

  useEffect(() => {
    fetchArmor().then((_items: IArmor[]) => {
      setArmors(_items);
    });
  }, []);

  const handleAddNewItem = () => {
    setAddingNewItem(true);
    setEditingItem(null);
  };

  const handleChange = () => {
    fetchArmor().then((_items: IArmor[]) => {
      setArmors(_items);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Armor</CardTitle>
        <CardDescription>A list of all the armor pieces in game.</CardDescription>
        <div className="mt-4">
          <Button onClick={handleAddNewItem}>New Armor</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full space-y-4">
          {/* ModifyItem for adding or editing */}
          {(addingNewItem || editingItem) && (
            <ArmorForm
              armor={editingItem ?? undefined}
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
              {armors.map((item) => (
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
