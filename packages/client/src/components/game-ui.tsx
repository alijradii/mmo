import React, { useEffect, useState } from "react";
import { PlayerUIData } from "../game/eventBus/types";
import { eventBus } from "../game/eventBus/eventBus";
import { SkillBar } from "./skillbar";
import { GameChat } from "./game-chat";
import { GameToolbar } from "./toolbar";
import { GameInventory } from "./game-inventory";
import { GameHotbar } from "./game-hotbar";
import { BottomBar } from "./bottom-bar";

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

  return (
    <div
      className={`fixed w-screen h-screen z-[50] pointer-events-none ${
        hidden ? "hidden" : ""
      }`}
    >
      <GameChat />

      <GameToolbar />
      <GameHotbar />

      <GameInventory />
    
      <BottomBar playerData={playerData} />

      {/* Top Right - Player Coordinates */}
      <div className="absolute top-4 right-4 p-3 rounded-lg text-white bg-gray-900 bg-opacity-80">
        <div className="text-sm">X: {playerData.x.toFixed(2)}</div>
        <div className="text-sm">Y: {playerData.y.toFixed(2)}</div>
        <div className="text-sm">Z: {playerData.z.toFixed(2)}</div>
      </div>
    </div>
  );
};
