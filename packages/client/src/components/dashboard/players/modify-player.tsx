import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { IPlayer } from "@backend/database/models/player.model";
import { deletePlayer, updatePlayer } from "@/utils/fetchPlayers";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModifyPlayerProps {
  player: IPlayer;
  onChange?: () => void;
  onCancel?: () => void;
}

export const ModifyPlayer: React.FC<ModifyPlayerProps> = ({
  player,
  onChange,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IPlayer>(player);

  useEffect(() => {
    setFormData(player);
  }, [player]);

  const handleInputChange = (field: keyof IPlayer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (stat: keyof IPlayer, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [stat]: numValue }));
  };

  const onDelete = () => {
    if (!player._id) return;

    if (!confirm(`Are you sure you want to delete ${player.username}?`)) {
      return;
    }

    deletePlayer(player._id)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully deleted player" });
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
    updatePlayer(formData)
      .then((response) => {
        console.log(response);
        toast({ title: "Success", description: "Successfully updated player" });
        if (onChange) onChange();
      })
      .catch((err) => {
        toast({
          title: "Oops!",
          description: err.response?.data?.message || "Something went wrong",
        });
        console.log(err);
      });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold">Edit Player: {player.username}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Info */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Username"
            />
          </div>

          <div>
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              type="number"
              value={formData.level}
              onChange={(e) => handleStatChange("level", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="xp">Experience Points</Label>
            <Input
              id="xp"
              type="number"
              value={formData.xp}
              onChange={(e) => handleStatChange("xp", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="coins">Coins</Label>
            <Input
              id="coins"
              type="number"
              value={formData.coins}
              onChange={(e) => handleStatChange("coins", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="race">Race</Label>
            <Select
              value={formData.race}
              onValueChange={(value) => handleInputChange("race", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="elf">Elf</SelectItem>
                <SelectItem value="dwarf">Dwarf</SelectItem>
                <SelectItem value="orc">Orc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              value={formData.class}
              onChange={(e) => handleInputChange("class", e.target.value)}
              placeholder="Class ID"
            />
          </div>

          <div>
            <Label htmlFor="map">Map</Label>
            <Input
              id="map"
              value={formData.map}
              onChange={(e) => handleInputChange("map", e.target.value)}
              placeholder="Map ID"
            />
          </div>

          <div>
            <Label htmlFor="party">Party</Label>
            <Input
              id="party"
              type="number"
              value={formData.party}
              onChange={(e) => handleStatChange("party", e.target.value)}
            />
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="x">Position X</Label>
            <Input
              id="x"
              type="number"
              value={formData.x}
              onChange={(e) => handleStatChange("x", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="y">Position Y</Label>
            <Input
              id="y"
              type="number"
              value={formData.y}
              onChange={(e) => handleStatChange("y", e.target.value)}
            />
          </div>
        </div>

        {/* Ability Scores */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Ability Scores</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="STR">Strength (STR)</Label>
              <Input
                id="STR"
                type="number"
                value={formData.STR}
                onChange={(e) => handleStatChange("STR", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="DEX">Dexterity (DEX)</Label>
              <Input
                id="DEX"
                type="number"
                value={formData.DEX}
                onChange={(e) => handleStatChange("DEX", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="INT">Intelligence (INT)</Label>
              <Input
                id="INT"
                type="number"
                value={formData.INT}
                onChange={(e) => handleStatChange("INT", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="WIS">Wisdom (WIS)</Label>
              <Input
                id="WIS"
                type="number"
                value={formData.WIS}
                onChange={(e) => handleStatChange("WIS", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="CHA">Charisma (CHA)</Label>
              <Input
                id="CHA"
                type="number"
                value={formData.CHA}
                onChange={(e) => handleStatChange("CHA", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="CON">Constitution (CON)</Label>
              <Input
                id="CON"
                type="number"
                value={formData.CON}
                onChange={(e) => handleStatChange("CON", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="points">Available Points</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => handleStatChange("points", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="primaryAttribute">Primary Attribute</Label>
              <Select
                value={formData.primaryAttribute || undefined}
                onValueChange={(value) =>
                  handleInputChange("primaryAttribute", value || "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (Select primary attribute)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STR">Strength</SelectItem>
                  <SelectItem value="DEX">Dexterity</SelectItem>
                  <SelectItem value="INT">Intelligence</SelectItem>
                  <SelectItem value="WIS">Wisdom</SelectItem>
                  <SelectItem value="CHA">Charisma</SelectItem>
                  <SelectItem value="CON">Constitution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave}>Update Player</Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete Player
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

