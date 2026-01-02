import { IPlayer } from "@backend/database/models/player.model";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlayerDisplayProps {
  player: IPlayer;
  onClick: () => void;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  player,
  onClick,
}) => {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{player.username}</h3>
            <Badge variant="outline">Level {player.level}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">ID:</span>{" "}
              <span className="font-mono text-xs">{player._id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Class:</span>{" "}
              <span className="capitalize">{player.class || "None"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Race:</span>{" "}
              <span className="capitalize">{player.race || "None"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">XP:</span>{" "}
              <span>{player.xp}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Coins:</span>{" "}
              <span>{player.coins || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Map:</span>{" "}
              <span>{player.map}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap text-xs">
            <Badge variant="secondary">STR: {player.STR}</Badge>
            <Badge variant="secondary">DEX: {player.DEX}</Badge>
            <Badge variant="secondary">INT: {player.INT}</Badge>
            <Badge variant="secondary">WIS: {player.WIS}</Badge>
            <Badge variant="secondary">CHA: {player.CHA}</Badge>
            <Badge variant="secondary">CON: {player.CON}</Badge>
            {player.points > 0 && (
              <Badge variant="default">Points: {player.points}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

