import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Backpack, User, Map, Settings, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { eventBus } from "@/game/eventBus/eventBus";

export const GameToolbar: React.FC = () => {
  const [activePanel, setActivePanel] = useState<
    null | "inventory" | "character" | "map" | "settings"
  >(null);

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div className="">
      {/* Active Panel Display */}
      {activePanel && (
        <Card className="absolute bottom-24 left-1/2 -translate-x-1/2 w-96 z-50 shadow-2xl border-2 border-gray-700">
          <CardContent className="p-4 flex flex-col space-y-4 relative bg-gray-900 text-white">
            <Button
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setActivePanel(null)}
              variant="ghost"
            >
              <X className="w-5 h-5" />
            </Button>

            <h2 className="text-lg font-bold capitalize">{activePanel}</h2>
            <div className="text-sm opacity-80">
              {activePanel === "inventory" && (
                <p>Inventory contents go here...</p>
              )}
              {activePanel === "character" && (
                <p>Character stats and equipment...</p>
              )}
              {activePanel === "map" && <p>World map opens here...</p>}
              {activePanel === "settings" && (
                <p>Game settings and preferences...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toolbar */}
      <div className="pointer-events-auto w-80 fixed bottom-4 left-4 border bg-background/80 backdrop-blur-sm rounded-xl px-6 flex gap-4 shadow-lg z-40">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => eventBus.emit("toggle-inventory")}
        >
          <Backpack className="h-6 w-6 text-white" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => togglePanel("character")}
        >
          <User className="h-6 w-6 text-white" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => togglePanel("map")}>
          <Map className="h-6 w-6 text-white" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => togglePanel("settings")}
        >
          <Settings className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
};
