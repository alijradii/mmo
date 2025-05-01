import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { races } from "../data/races";
import { useAtom } from "jotai";
import { displayDataAtom } from "@/state/userAtom";
import { IPlayer } from "@backend/database/models/player.model";

export const RaceTab: React.FC = () => {
  const [userData, setUserData] = useAtom(displayDataAtom);
  const handleRaceSelect = (race: string) => {
    if (userData) {
      const data: IPlayer = userData;
      setUserData({ ...data, race });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Race</CardTitle>
        <CardDescription>
          Each race provides unique bonuses and abilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {races.map((race) => (
            <Card
              key={race.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                userData?.race === race.id ? "border-2 border-primary" : ""
              }`}
              onClick={() => handleRaceSelect(race.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={race.icon || "/placeholder.svg"}
                    alt={race.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-border"
                  />
                  <CardTitle className="text-lg">{race.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  {race.description}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {race.bonuses}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
