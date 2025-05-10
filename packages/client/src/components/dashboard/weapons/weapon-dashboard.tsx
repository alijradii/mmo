import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWeapons } from "@/utils/fetchWeapons";
import { useEffect, useState } from "react";
import { WeaponForm } from "./weapon-form";
import { ItemDisplay } from "./weapon-display";
import { IWeapon } from "@backend/database/models/weapon.model";

export const WeaponsDashboard: React.FC = () => {
  const [weapons, setWeapons] = useState<IWeapon[]>([]);
  const [addingNewItem, setAddingNewItem] = useState(false);

  const [editingItem, setEditingItem] = useState<IWeapon | null>(null);

  useEffect(() => {
    fetchWeapons().then((_items: IWeapon[]) => {
      setWeapons(_items);
    });
  }, []);

  const handleAddNewItem = () => {
    setAddingNewItem(true);
    setEditingItem(null);
  };

  const handleChange = () => {
    fetchWeapons().then((_items: IWeapon[]) => {
      setWeapons(_items);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weapons</CardTitle>
        <CardDescription>A list of all the weapons in game.</CardDescription>
        <div className="mt-4">
          <Button onClick={handleAddNewItem}>New Weapon</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full space-y-4">
          {/* ModifyItem for adding or editing */}
          {(addingNewItem || editingItem) && (
            <WeaponForm
              weapon={editingItem ?? undefined}
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
              {weapons.map((item) => (
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
