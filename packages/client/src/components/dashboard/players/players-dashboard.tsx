import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPlayers } from "@/utils/fetchPlayers";
import { useEffect, useState } from "react";
import { IPlayer } from "@backend/database/models/player.model";
import { ModifyPlayer } from "./modify-player";
import { PlayerDisplay } from "./player-display";

export const PlayersDashboard: React.FC = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<IPlayer[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<IPlayer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadPlayers = () => {
    setIsLoading(true);
    fetchPlayers()
      .then((_players: IPlayer[]) => {
        setPlayers(_players);
        setFilteredPlayers(_players);
      })
      .catch((error) => {
        console.error("Failed to fetch players:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPlayers(players);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = players.filter(
        (player) =>
          player.username.toLowerCase().includes(query) ||
          player._id?.toLowerCase().includes(query) ||
          player.class.toLowerCase().includes(query) ||
          player.race.toLowerCase().includes(query)
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  const handleChange = () => {
    loadPlayers();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
        <CardDescription>
          Manage all players in the game. Total: {players.length}
        </CardDescription>
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Search by username, ID, class, or race..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
          <Button variant="outline" onClick={loadPlayers}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full space-y-4">
          {/* ModifyPlayer for editing */}
          {editingPlayer && (
            <ModifyPlayer
              player={editingPlayer}
              onChange={() => handleChange()}
              onCancel={() => {
                setEditingPlayer(null);
              }}
            />
          )}

          {/* List of players */}
          {!editingPlayer && (
            <div>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading players...
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? "No players found matching your search."
                    : "No players found."}
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredPlayers.length} of {players.length} players
                  </div>
                  {filteredPlayers.map((player) => (
                    <PlayerDisplay
                      key={player._id}
                      player={player}
                      onClick={() => {
                        setEditingPlayer(player);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

