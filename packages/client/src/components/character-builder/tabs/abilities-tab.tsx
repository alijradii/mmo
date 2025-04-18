"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Zap,
  Heart,
  Eye,
  Footprints,
  Brain,
  Star,
  Shield,
} from "lucide-react";
import type { AbilityPoints } from "../use-character-state";
import type { SecondaryStats } from "../utils/stat-calculations";
import { useAtom } from "jotai";
import { userDataAtom } from "@/state/userAtom";

interface AbilitiesTabProps {
  secondaryStats: SecondaryStats;
}

export const AbilitiesTab: React.FC<AbilitiesTabProps> = ({
  secondaryStats,
}) => {
  const [userData, setUserData] = useAtom(userDataAtom);

  const handleAbilityChange = (
    ability: keyof AbilityPoints,
    value: number[]
  ) => {
    const newValue = value[0];
    const oldValue = userData?.[ability] || 0;
    const pointDifference = newValue - oldValue;
    const pointsRemaining = userData?.points || 0;

    if (pointsRemaining - pointDifference >= 0 || pointDifference < 0) {
      if (userData)
        setUserData({
          ...userData,
          [ability]: newValue,
          points: pointsRemaining - pointDifference,
        });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ability Scores</CardTitle>
          <CardDescription>
            Customize your character's core attributes. You have{" "}
            {userData?.points || 0} points remaining.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <AbilitySlider
                id="strength"
                label="Strength"
                icon={<Swords className="h-4 w-4" />}
                value={userData?.STR || 0}
                onChange={(value) => handleAbilityChange("STR", value)}
                description="Physical power, melee damage, and carrying capacity"
              />

              <AbilitySlider
                id="dexterity"
                label="Dexterity"
                icon={<Zap className="h-4 w-4" />}
                value={userData?.DEX || 0}
                onChange={(value) => handleAbilityChange("DEX", value)}
                description="Agility, reflexes, balance, and ranged combat accuracy"
              />

              <AbilitySlider
                id="constitution"
                label="Constitution"
                icon={<Heart className="h-4 w-4" />}
                value={userData?.CON || 0}
                onChange={(value) => handleAbilityChange("CON", value)}
                description="Health, stamina, and resistance to poison and disease"
              />
            </div>

            <div className="space-y-4">
              <AbilitySlider
                id="intelligence"
                label="Intelligence"
                icon={<Brain className="h-4 w-4" />}
                value={userData?.INT || 0}
                onChange={(value) => handleAbilityChange("INT", value)}
                description="Memory, reasoning, and spellcasting ability for wizards"
              />

              <AbilitySlider
                id="wisdom"
                label="Wisdom"
                icon={<Eye className="h-4 w-4" />}
                value={userData?.WIS || 0}
                onChange={(value) => handleAbilityChange("WIS", value)}
                description="Perception, insight, and spellcasting ability for clerics"
              />

              <AbilitySlider
                id="charisma"
                label="Charisma"
                icon={<Star className="h-4 w-4" />}
                value={userData?.CHA || 0}
                onChange={(value) => handleAbilityChange("CHA", value)}
                description="Force of personality, persuasion, and social influence"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary Statistics</CardTitle>
          <CardDescription>
            Derived from your primary ability scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatDisplay
              label="Health"
              icon={<Heart className="h-4 w-4 text-destructive" />}
              value={secondaryStats.health}
              maxValue={300}
            />

            <StatDisplay
              label="Mana"
              icon={<Zap className="h-4 w-4 text-primary" />}
              value={secondaryStats.mana}
              maxValue={200}
            />

            <StatDisplay
              label="Defense"
              icon={<Shield className="h-4 w-4" />}
              value={secondaryStats.defense}
              maxValue={50}
            />

            <StatDisplay
              label="Critical Chance"
              icon={<Swords className="h-4 w-4 text-destructive" />}
              value={secondaryStats.criticalChance}
              maxValue={30}
              suffix="%"
            />

            <StatDisplay
              label="Speed"
              icon={<Footprints className="h-4 w-4" />}
              value={secondaryStats.speed}
              maxValue={60}
              suffix=" ft"
            />

            <StatDisplay
              label="Perception"
              icon={<Eye className="h-4 w-4" />}
              value={secondaryStats.perception}
              maxValue={30}
            />

            <StatDisplay
              label="Spell Power"
              icon={<Zap className="h-4 w-4 text-primary" />}
              value={secondaryStats.spellPower}
              maxValue={30}
            />

            <StatDisplay
              label="Physical Power"
              icon={<Swords className="h-4 w-4" />}
              value={secondaryStats.physicalPower}
              maxValue={30}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AbilitySliderProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number[]) => void;
  description: string;
}

const AbilitySlider: React.FC<AbilitySliderProps> = ({
  id,
  label,
  icon,
  value,
  onChange,
  description,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center gap-2">
          {icon} {label}
        </Label>
        <span className="text-lg font-bold">{value}</span>
      </div>
      <Slider
        id={id}
        min={8}
        max={18}
        step={1}
        value={[value]}
        onValueChange={onChange}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

interface StatDisplayProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  maxValue: number;
  suffix?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  icon,
  value,
  maxValue,
  suffix = "",
}) => {
  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-medium">
          {icon} {label}
        </Label>
        <span>
          {value}
          {suffix}
        </span>
      </div>
      <Progress value={(value / maxValue) * 100} className="h-2" />
    </div>
  );
};
