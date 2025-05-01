import { useCallback, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IClass } from "@backend/database/models/class.model";
import { useAtom } from "jotai";
import { displayDataAtom } from "@/state/userAtom";

interface ClassCardProps {
  classItem: IClass;
  selected: boolean;
  onSelect: (id: string) => void;
}

type AbilityScoreType = "STR" | "DEX" | "INT" | "CON" | "WIS" | "CHA" | "";
const AbilityScoresList = ["STR", "DEX", "INT", "CON", "WIS", "CHA"];

export function ClassCard({ classItem, selected, onSelect }: ClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [displayData, setDisplayData] = useAtom(displayDataAtom);

  const isValidAbilityScore = (attr: string): attr is AbilityScoreType => {
    return (AbilityScoresList as readonly string[]).includes(attr);
  };

  const setSelectedAttribute = useCallback(
    (attribute: string) => {
      if (isValidAbilityScore(attribute) && displayData) {
        setDisplayData({ ...displayData, primaryAttribute: attribute });
        console.log("changed to: ", attribute);
      }
    },
    [displayData, setDisplayData]
  );

  const abilities = classItem.keyAbilities;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleAttributeSelect = (attribute: string, e: React.MouseEvent) => {
    if (!selected) return;
    e.stopPropagation();
    setSelectedAttribute(attribute);
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md overflow-hidden",
        selected
          ? "border-2 border-primary ring-1 ring-primary/20"
          : "hover:border-primary/50"
      )}
      onClick={() => {
        onSelect(classItem._id);
      }}
    >
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-xl capitalize text-center">
          {classItem._id}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5">
        <div className="mb-4 bg-muted/30 p-3 rounded-lg">
          <p
            className={cn(
              "text-sm text-muted-foreground leading-relaxed",
              isExpanded ? "" : "line-clamp-2"
            )}
          >
            {classItem.description}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 px-2 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm font-medium">Hitpoints</span>
          <Badge variant="secondary" className="font-mono">
            {classItem.hitpoints}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch pt-2 pb-4 px-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Primary Attribute</span>
          {selected && abilities.length > 1 && (
            <span className="text-xs text-muted-foreground italic">
              Select one
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {abilities.map((ability) => (
            <Badge
              key={ability}
              variant={
                displayData?.primaryAttribute === ability && selected
                  ? "default"
                  : "outline"
              }
              className={cn(
                "py-1.5 px-3 transition-all",
                selected ? "cursor-pointer" : "",
                displayData?.primaryAttribute === ability && selected
                  ? "bg-primary text-primary-foreground font-medium"
                  : selected
                  ? "hover:bg-primary/10"
                  : "opacity-80"
              )}
              onClick={(e) => handleAttributeSelect(ability, e)}
            >
              {ability}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
