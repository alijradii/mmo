import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Backpack, User, Map, Settings, X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { eventBus } from "@/game/eventBus/eventBus";
import { useIsMobile } from "@/hooks/use-mobile";

const MOBILE_BREAKPOINT = 768;

export const GameToolbar: React.FC = () => {
  const [activePanel, setActivePanel] = useState<
    null | "inventory" | "character" | "map" | "settings"
  >(null);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT);

  useEffect(() => {
    // Hide toolbar by default on mobile
    if (isMobile) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    // Listen for toolbar toggle events from game-ui
    const handleToggle = () => {
      setIsVisible((prev) => !prev);
    };
    eventBus.on("toggle-toolbar", handleToggle);

    return () => {
      eventBus.off("toggle-toolbar", handleToggle);
    };
  }, [isMobile]);

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div className="">
      {/* Active Panel Display */}
      {activePanel && (
        <Card
          className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-50 shadow-2xl border-2 border-gray-700 ${
            isMobile ? "w-[calc(100vw-2rem)] max-w-sm" : "w-96"
          }`}
        >
          <CardContent className="p-4 flex flex-col space-y-4 relative bg-gray-900 text-white">
            <Button
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setActivePanel(null)}
              variant="ghost"
            >
              <X className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
            </Button>

            <h2 className={`${isMobile ? "text-base" : "text-lg"} font-bold capitalize`}>
              {activePanel}
            </h2>
            <div className={`${isMobile ? "text-xs" : "text-sm"} opacity-80`}>
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
      {isVisible && (
        <div
          className={`pointer-events-auto fixed bottom-4 left-4 border bg-background/80 backdrop-blur-sm rounded-xl shadow-lg z-40 flex gap-2 md:gap-4 ${
            isMobile
              ? "px-2 py-2"
              : "w-80 px-6"
          }`}
        >
          {isMobile && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={isMobile ? "h-8 w-8" : ""}
            onClick={() => eventBus.emit("toggle-inventory")}
          >
            <Backpack className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={isMobile ? "h-8 w-8" : ""}
            onClick={() => togglePanel("character")}
          >
            <User className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={isMobile ? "h-8 w-8" : ""}
            onClick={() => togglePanel("map")}
          >
            <Map className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={isMobile ? "h-8 w-8" : ""}
            onClick={() => togglePanel("settings")}
          >
            <Settings className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
          </Button>
        </div>
      )}
    </div>
  );
};
