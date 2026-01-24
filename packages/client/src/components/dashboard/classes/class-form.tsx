import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteClass,
  updateOrCreateClass,
} from "@/utils/fetchClassesData";
import { ArmorGroup } from "@backend/database/models/armor.model";
import { IClass } from "@backend/database/models/class.model";
import { WeaponGroup } from "@backend/database/models/weapon.model";
import React, { useEffect, useState } from "react";
import { AbilityScoreType, AbilityScoresList } from "../../../../../server/src/game/modules/abilityScores/abilityScores";

import { toast } from "@/hooks/use-toast";
import { fetchWeapons } from "@/utils/fetchWeapons";
import { IWeapon } from "@backend/database/models/weapon.model";

interface ClassFormProps {
  classItem?: IClass;
  onChange: () => void;
  onCancel: () => void;
}

const weaponGroups: WeaponGroup[] = ["sword", "axe", "wand", "spear", "bow", "misc"];
const armorGroups: ArmorGroup[] = ["light", "medium", "heavy"];

export const ClassForm: React.FC<ClassFormProps> = ({
  classItem,
  onChange,
  onCancel,
}) => {
  const [id, setId] = useState(classItem?._id || "");
  const [description, setDescription] = useState(classItem?.description || "");
  const [keyAbilities, setKeyAbilities] = useState<AbilityScoreType[]>(
    classItem?.keyAbilities || []
  );
  const [hitpoints, setHitpoints] = useState<number>(classItem?.hitpoints || 100);
  const [speed, setSpeed] = useState<number>(classItem?.speed || 100);
  const [startingWeapon, setStartingWeapon] = useState<string>(
    classItem?.startingWeapon || ""
  );
  const [weapons, setWeapons] = useState<WeaponGroup[]>(
    classItem?.weapons || []
  );
  const [armor, setArmor] = useState<ArmorGroup[]>(classItem?.armor || []);
  const [availableWeapons, setAvailableWeapons] = useState<IWeapon[]>([]);

  const [selectedAbility, setSelectedAbility] = useState<AbilityScoreType>("STR");
  const [selectedWeaponGroup, setSelectedWeaponGroup] = useState<WeaponGroup>("sword");
  const [selectedArmorGroup, setSelectedArmorGroup] = useState<ArmorGroup>("light");

  useEffect(() => {
    fetchWeapons()
      .then((weapons) => {
        setAvailableWeapons(weapons);
      })
      .catch((err) => {
        console.error("Failed to fetch weapons:", err);
      });
  }, []);

  const handleAddKeyAbility = () => {
    if (!keyAbilities.includes(selectedAbility)) {
      setKeyAbilities([...keyAbilities, selectedAbility]);
    }
  };

  const handleRemoveKeyAbility = (ability: AbilityScoreType) => {
    setKeyAbilities(keyAbilities.filter((a) => a !== ability));
  };

  const handleAddWeaponGroup = () => {
    if (!weapons.includes(selectedWeaponGroup)) {
      setWeapons([...weapons, selectedWeaponGroup]);
    }
  };

  const handleRemoveWeaponGroup = (group: WeaponGroup) => {
    setWeapons(weapons.filter((w) => w !== group));
  };

  const handleAddArmorGroup = () => {
    if (!armor.includes(selectedArmorGroup)) {
      setArmor([...armor, selectedArmorGroup]);
    }
  };

  const handleRemoveArmorGroup = (group: ArmorGroup) => {
    setArmor(armor.filter((a) => a !== group));
  };

  const handleSubmit = () => {
    const newClass: IClass = {
      _id: classItem?._id || id,
      description,
      keyAbilities,
      hitpoints,
      speed,
      startingWeapon,
      weapons,
      armor,
    };

    updateOrCreateClass(newClass)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully created/updated class" });
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
    deleteClass(id)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully deleted class" });
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
        <Label>Class ID</Label>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={classItem?._id !== undefined && classItem?._id !== ""}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Hitpoints</Label>
          <Input
            type="number"
            value={hitpoints}
            onChange={(e) => setHitpoints(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Speed</Label>
          <Input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label>Starting Weapon</Label>
        <Select value={startingWeapon} onValueChange={setStartingWeapon}>
          <SelectTrigger>
            <SelectValue placeholder="Select starting weapon" />
          </SelectTrigger>
          <SelectContent>
            {availableWeapons.map((weapon) => (
              <SelectItem key={weapon._id} value={weapon._id}>
                {weapon.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Key Abilities</Label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              value={selectedAbility}
              onValueChange={(val) => setSelectedAbility(val as AbilityScoreType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AbilityScoresList.map((ability) => (
                  <SelectItem key={ability} value={ability}>
                    {ability}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddKeyAbility}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {keyAbilities.map((ability) => (
            <Badge
              key={ability}
              onClick={() => handleRemoveKeyAbility(ability)}
              className="cursor-pointer"
            >
              {ability} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Weapon Groups</Label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              value={selectedWeaponGroup}
              onValueChange={(val) => setSelectedWeaponGroup(val as WeaponGroup)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weaponGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddWeaponGroup}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {weapons.map((group) => (
            <Badge
              key={group}
              onClick={() => handleRemoveWeaponGroup(group)}
              className="cursor-pointer"
            >
              {group} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Armor Groups</Label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              value={selectedArmorGroup}
              onValueChange={(val) => setSelectedArmorGroup(val as ArmorGroup)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {armorGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddArmorGroup}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {armor.map((group) => (
            <Badge
              key={group}
              onClick={() => handleRemoveArmorGroup(group)}
              className="cursor-pointer"
            >
              {group} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1" onClick={handleSubmit}>
          {classItem ? "Update Class" : "Create Class"}
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

