import React, { useState } from "react";

import {
  IWeapon,
  WeaponGroup,
  DamageType,
} from "@backend/database/models/weapon.model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteWeapon, updateOrCreateWeapon } from "@/utils/fetchWeapons";
import { toast } from "@/hooks/use-toast";

interface WeaponFormProps {
  weapon?: IWeapon;
  onChange: () => void;
  onCancel: () => void;
}

const weaponGroups: WeaponGroup[] = ["sword", "axe", "wand", "spear", "bow"];
const damageTypes: DamageType[] = [
  "slashing",
  "piercing",
  "bludgeoning",
  "mental",
  "acid",
  "cold",
  "fire",
  "electric",
  "sonic",
  "force",
  "poison",
  "bleed",
  "precision",
];

export const WeaponForm: React.FC<WeaponFormProps> = ({
  weapon,
  onChange,
  onCancel,
}) => {
  const [id, setId] = useState(weapon?._id || "");
  const [name, setName] = useState(weapon?.name || "");
  const [description, setDescription] = useState(weapon?.description || "");
  const [group, setGroup] = useState<WeaponGroup>(weapon?.group || "sword");
  const [ranged, setRanged] = useState<boolean>(weapon?.ranged || false);
  const [traits, setTraits] = useState<string[]>(weapon?.traits || []);
  const [traitInput, setTraitInput] = useState("");
  const [damage, setDamage] = useState<number>(weapon?.damage || 1);
  const [damageType, setDamageType] = useState<DamageType>(
    weapon?.damageType || "slashing"
  );
  const [requiredLevel, setRequiredLevel] = useState<number>(
    weapon?.requiredLevel || 1
  );
  const [attackSpeed, setAttackSpeed] = useState<number>(
    weapon?.attackSpeed || 1
  );
  const [attackForce, setAttackForce] = useState<number>(
    weapon?.attackForce || 1
  );

  const handleAddTrait = () => {
    if (traitInput.trim() && !traits.includes(traitInput.trim())) {
      setTraits([...traits, traitInput.trim()]);
      setTraitInput("");
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter((t) => t !== trait));
  };

  const handleSubmit = () => {
    const newWeapon: IWeapon = {
      _id: weapon?._id || id,
      name,
      description,
      group,
      ranged,
      traits,
      damage,
      damageType,
      requiredLevel,
      attackSpeed,
      attackForce,
    };
    updateOrCreateWeapon(newWeapon)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully created item" });
        if (onChange) onChange();
      })
      .catch((err) => {
        toast({
          title: "Oops!",
          description: "Something went wrong",
        });

        console.log(err);
      });
    onChange();
  };

  const handleDelete = () => {
    deleteWeapon(id)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully deleted weapon" });
        if (onChange) onChange();
      })
      .catch((err) => {
        toast({
          title: "Oops!",
          description: "Something went wrong",
        });

        console.log(err);
      });
    onChange();
    onCancel();
  };

  return (
    <div className="space-y-4 p-4 max-w-lg">
      <div>
        <Label>Id</Label>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={weapon?._id !== undefined && weapon?._id !== ""}
        />
      </div>

      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label>Group</Label>
        <Select
          value={group}
          onValueChange={(val) => setGroup(val as WeaponGroup)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {weaponGroups.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={ranged}
          onCheckedChange={(v) => setRanged(!!v)}
          id="ranged"
        />
        <Label htmlFor="ranged">Ranged</Label>
      </div>

      <div>
        <Label>Traits</Label>
        <div className="flex gap-2">
          <Input
            value={traitInput}
            onChange={(e) => setTraitInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTrait())
            }
            placeholder="Add trait"
          />
          <Button onClick={handleAddTrait}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {traits.map((trait) => (
            <Badge
              key={trait}
              onClick={() => handleRemoveTrait(trait)}
              className="cursor-pointer"
            >
              {trait} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Damage</Label>
          <Input
            type="number"
            value={damage}
            onChange={(e) => setDamage(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Damage Type</Label>
          <Select
            value={damageType}
            onValueChange={(val) => setDamageType(val as DamageType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {damageTypes.map((dt) => (
                <SelectItem key={dt} value={dt}>
                  {dt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Required Level</Label>
          <Input
            type="number"
            value={requiredLevel}
            onChange={(e) => setRequiredLevel(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Attack Speed</Label>
          <Input
            type="number"
            step="0.5"
            value={attackSpeed}
            onChange={(e) => setAttackSpeed(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Attack Force</Label>
          <Input
            type="number"
            step="1"
            value={attackForce}
            onChange={(e) => setAttackForce(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1" onClick={handleSubmit}>
          {weapon ? "Update Weapon" : "Create Weapon"}
        </Button>

        <Button
          className="flex-1"
          onClick={handleDelete}
          variant={"destructive"}
        >
          Delete
        </Button>

        <Button className="flex-1" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};
