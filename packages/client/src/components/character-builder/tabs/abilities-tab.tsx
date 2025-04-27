import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Swords, Zap, Heart, Eye, Footprints, Brain, Star, Shield, Plus } from "lucide-react"
import type { SecondaryStats } from "../utils/stat-calculations"
import { useAtom } from "jotai"
import { userDataAtom } from "@/state/userAtom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface AbilitiesTabProps {
  secondaryStats: SecondaryStats
}

// Define milestone levels where ability score improvements are granted
const MILESTONE_LEVELS = [4, 8, 12, 16, 19]

// Define ability score types
type AbilityType = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"

export const AbilitiesTab: React.FC<AbilitiesTabProps> = ({ secondaryStats }) => {
  const [userData, setUserData] = useAtom(userDataAtom)

  // Calculate available improvements based on character level
  const characterLevel = userData?.level || 1
  const availableImprovements = userData?.points || 0;

  const handleAbilityImprovement = (ability: AbilityType) => {
    if (!userData || availableImprovements <= 0) return

    const currentValue = userData[ability] || 0
    // Typically D&D has a cap of 20 for ability scores
    if (currentValue < 20) {
      setUserData({
        ...userData,
        [ability]: currentValue + 1,
        points: (userData.points || 0) + 1,
      })
    }
  }

  // Get the next milestone level
  const getNextMilestoneLevel = () => {
    return MILESTONE_LEVELS.find((level) => level > characterLevel) || "None"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ability Scores</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              Level {characterLevel}
            </Badge>
          </div>
          <CardDescription>
            Improve your abilities at milestone levels. You have {availableImprovements} ability improvements available.
            {availableImprovements > 0 && (
              <span className="font-medium text-primary"> Click on an ability to improve it.</span>
            )}
          </CardDescription>
          <div className="mt-2 text-sm">
            <div className="flex flex-wrap gap-2">
              {MILESTONE_LEVELS.map((level) => (
                <Badge
                  key={level}
                  variant={level <= characterLevel ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  Level {level}
                  {level <= characterLevel && <Check className="h-3 w-3" />}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Next ability improvement at level {getNextMilestoneLevel()}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <AbilityDisplay
                id="strength"
                label="Strength"
                icon={<Swords className="h-4 w-4" />}
                value={userData?.STR || 0}
                onImprove={() => handleAbilityImprovement("STR")}
                description="Physical power, melee damage, and carrying capacity"
                canImprove={availableImprovements > 0}
              />

              <AbilityDisplay
                id="dexterity"
                label="Dexterity"
                icon={<Zap className="h-4 w-4" />}
                value={userData?.DEX || 0}
                onImprove={() => handleAbilityImprovement("DEX")}
                description="Agility, reflexes, balance, and ranged combat accuracy"
                canImprove={availableImprovements > 0}
              />

              <AbilityDisplay
                id="constitution"
                label="Constitution"
                icon={<Heart className="h-4 w-4" />}
                value={userData?.CON || 0}
                onImprove={() => handleAbilityImprovement("CON")}
                description="Health, stamina, and resistance to poison and disease"
                canImprove={availableImprovements > 0}
              />
            </div>

            <div className="space-y-4">
              <AbilityDisplay
                id="intelligence"
                label="Intelligence"
                icon={<Brain className="h-4 w-4" />}
                value={userData?.INT || 0}
                onImprove={() => handleAbilityImprovement("INT")}
                description="Memory, reasoning, and spellcasting ability for wizards"
                canImprove={availableImprovements > 0}
              />

              <AbilityDisplay
                id="wisdom"
                label="Wisdom"
                icon={<Eye className="h-4 w-4" />}
                value={userData?.WIS || 0}
                onImprove={() => handleAbilityImprovement("WIS")}
                description="Perception, insight, and spellcasting ability for clerics"
                canImprove={availableImprovements > 0}
              />

              <AbilityDisplay
                id="charisma"
                label="Charisma"
                icon={<Star className="h-4 w-4" />}
                value={userData?.CHA || 0}
                onImprove={() => handleAbilityImprovement("CHA")}
                description="Force of personality, persuasion, and social influence"
                canImprove={availableImprovements > 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary Statistics</CardTitle>
          <CardDescription>Derived from your primary ability scores</CardDescription>
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
  )
}

interface AbilityDisplayProps {
  id: string
  label: string
  icon: React.ReactNode
  value: number
  onImprove: () => void
  description: string
  canImprove: boolean
}

const AbilityDisplay: React.FC<AbilityDisplayProps> = ({
  id,
  label,
  icon,
  value,
  onImprove,
  description,
  canImprove,
}) => {
  // Calculate modifier (D&D style: (score - 10) / 2, rounded down)
  const modifier = Math.floor((value - 10) / 2)
  const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center justify-between rounded-lg border p-3 ${
                canImprove ? "cursor-pointer hover:border-primary hover:bg-accent" : ""
              }`}
              onClick={canImprove ? onImprove : undefined}
            >
              <Label htmlFor={id} className="flex items-center gap-2">
                {icon} {label}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{value}</span>
                <span className="text-sm text-muted-foreground">({modifierText})</span>
                {canImprove && (
                  <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

interface StatDisplayProps {
  label: string
  icon: React.ReactNode
  value: number
  maxValue: number
  suffix?: string
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, icon, value, maxValue, suffix = "" }) => {
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
  )
}

// Missing import from the code
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)