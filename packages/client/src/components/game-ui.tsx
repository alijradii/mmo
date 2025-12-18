import React, { useEffect, useState } from "react";
import { PlayerUIData } from "../game/eventBus/types";
import { eventBus } from "../game/eventBus/eventBus";
import { GameChat } from "./game-chat";
import { GameToolbar } from "./toolbar";
import { GameInventory } from "./game-inventory";
import { GameHotbar } from "./game-hotbar";
import { BottomBar } from "./bottom-bar";
import { useIsMobile } from "../hooks/use-mobile";
import { MobileJoystick } from "./mobile-joystick";
import { Button } from "./ui/button";
import { MessageSquare, Package } from "lucide-react";
import { MobileZoomControl } from "./mobile-zoom-control";

export const GameUI: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerUIData>({
    name: "",
    hp: 0,
    maxHp: 0,
    x: 0,
    y: 0,
    z: 0,
  });

  const [hidden, setHidden] = useState(false);
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);

  eventBus.on("toggle-gui", () => {
    setHidden(!hidden);
  });

  useEffect(() => {
    // Event listener for UI updates
    const handlePlayerUIUpdate = (update: Partial<PlayerUIData>) => {
      setPlayerData((prev) => ({ ...prev, ...update }));
    };

    eventBus.on("update-self-ui", handlePlayerUIUpdate);

    return () => {
      eventBus.off("update-self-ui", handlePlayerUIUpdate);
    };
  }, []);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    eventBus.emit("toggle-chat-visibility", !chatOpen);
  };

  const toggleInventory = () => {
    eventBus.emit("toggle-inventory");
  };

  return (
    <div
      className={`fixed w-screen h-screen z-[50] pointer-events-none ${
        hidden ? "hidden" : ""
      }`}
    >
      {/* Mobile Joystick */}
      {isMobile && <MobileJoystick />}

      {/* Chat - Hidden on mobile unless toggled */}
      {(!isMobile || chatOpen) && <GameChat />}

      <GameToolbar />
      
      {/* Hotbar - Hidden on mobile */}
      {!isMobile && <GameHotbar />}

      <GameInventory />
    
      <BottomBar playerData={playerData} />

      {/* Top Right - Player Coordinates - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute top-4 right-4 p-3 rounded-lg text-white bg-gray-900 bg-opacity-80">
          <div className="text-sm">X: {playerData.x.toFixed(2)}</div>
          <div className="text-sm">Y: {playerData.y.toFixed(2)}</div>
          <div className="text-sm">Z: {playerData.z.toFixed(2)}</div>
        </div>
      )}

      {/* Mobile Action Buttons - Top Right */}
      {isMobile && (
        <div className="absolute top-4 right-4 pointer-events-auto z-50 flex flex-col gap-2 opacity-70">
          {/* Zoom Control Button */}
          <MobileZoomControl isMobile={isMobile} />

          {/* Chat Toggle Button */}
          <Button
            onClick={toggleChat}
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm border-2 border-white/40"
          >
            <MessageSquare className="h-5 w-5 text-white" />
          </Button>

          {/* Inventory Toggle Button */}
          <Button
            onClick={toggleInventory}
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm border-2 border-white/40"
          >
            <Package className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};
