import React, { useState } from "react";

import { IArmor } from "@backend/database/models/armor.model";
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

import {
  ArmorSlot,
  ArmorGroup,
  ArmorResistance,
} from "@backend/database/models/armor.model";

import { updateOrCreateArmor, deleteArmor } from "@/utils/fetchArmorData";
import { toast } from "@/hooks/use-toast";
import { DamageType } from "@backend/database/models/weapon.model";

interface ArmorFormProps {
  armor?: IArmor;
  onChange: () => void;
  onCancel: () => void;
}

const armorSlots: ArmorSlot[] = ["helmet", "chest", "legs", "boots"];
const armorGroups: ArmorGroup[] = ["light", "medium", "heavy"];
const resistanceTypes: DamageType[] = [
  "slashing",
  "piercing",
  "bludgeoning",
  "fire",
  "cold",
  "electric",
  "acid",
  "mental",
  "poison",
  "force",
  "sonic",
];

export const ArmorForm: React.FC<ArmorFormProps> = ({
  armor,
  onChange,
  onCancel,
}) => {
  const [id, setId] = useState(armor?._id || "");
  const [name, setName] = useState(armor?.name || "");
  const [description, setDescription] = useState(armor?.description || "");
  const [slot, setSlot] = useState<ArmorSlot>(armor?.slot || "helmet");
  const [group, setGroup] = useState<ArmorGroup>(armor?.group || "light");
  const [requiredLevel, setRequiredLevel] = useState(armor?.requiredLevel || 1);
  const [armorBonus, setArmorBonus] = useState(armor?.armorBonus || 0);
  const [resistances, setResistances] = useState<ArmorResistance[]>(
    armor?.resistances || []
  );
  const [traits, setTraits] = useState<string[]>(armor?.traits || []);
  const [traitInput, setTraitInput] = useState("");

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
    const newArmor: IArmor = {
      _id: armor?._id || id,
      name,
      description,
      slot,
      group,
      requiredLevel,
      armorBonus,
      resistances,
      traits,
    };

    updateOrCreateArmor(newArmor)
      .then(() => {
        toast({ title: "Success", description: "Successfully saved armor" });
        onChange();
      })
      .catch((err) => {
        toast({ title: "Error", description: "Failed to save armor" });
        console.error(err);
      });
  };

  const handleDelete = () => {
    deleteArmor(id)
      .then(() => {
        toast({ title: "Deleted", description: "Armor deleted" });
        onChange();
        onCancel();
      })
      .catch((err) => {
        toast({ title: "Error", description: "Failed to delete armor" });
        console.error(err);
      });
  };

  return (
    <div className="space-y-4 p-4 max-w-lg">
      <div>
        <Label>Id</Label>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={armor?._id !== undefined && armor?._id !== ""}
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
        <Label>Slot</Label>
        <Select value={slot} onValueChange={(val) => setSlot(val as ArmorSlot)}>
          <SelectTrigger>
            <SelectValue placeholder="Select slot" />
          </SelectTrigger>
          <SelectContent>
            {armorSlots.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Group</Label>
        <Select
          value={group}
          onValueChange={(val) => setGroup(val as ArmorGroup)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {armorGroups.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Armor Bonus</Label>
        <Input
          type="number"
          value={armorBonus}
          onChange={(e) => setArmorBonus(Number(e.target.value))}
        />
      </div>

      <div>
        <Label>Required Level</Label>
        <Input
          type="number"
          value={requiredLevel}
          onChange={(e) => setRequiredLevel(Number(e.target.value))}
        />
      </div>

      <div>
        <Label>Resistances</Label>
        {resistances.map((res, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Select
              value={res.type}
              onValueChange={(val) => {
                const updated = [...resistances];
                updated[index] = { ...updated[index], type: val as DamageType };
                setResistances(updated);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Damage Type" />
              </SelectTrigger>
              <SelectContent>
                {resistanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              className="w-24"
              value={res.value}
              onChange={(e) => {
                const updated = [...resistances];
                updated[index] = {
                  ...updated[index],
                  value: parseInt(e.target.value),
                };
                setResistances(updated);
              }}
            />

            <Button
              variant="destructive"
              onClick={() => {
                setResistances(resistances.filter((_, i) => i !== index));
              }}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          className="ml-5"
          onClick={() =>
            setResistances([...resistances, { type: "slashing", value: 0 }])
          }
        >
          Add Resistance
        </Button>
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

      <div className="flex gap-4">
        <Button className="flex-1" onClick={handleSubmit}>
          {armor ? "Update Armor" : "Create Armor"}
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
  ); };
