import React, { useEffect, useState } from "react";
import { PlayerUIData } from "../game/eventBus/types";
import { eventBus } from "../game/eventBus/eventBus";
import { SkillBar } from "./skillbar";
import { GameChat } from "./game-chat";
import { GameToolbar } from "./toolbar";
import { GameInventory } from "./game-inventory";
import { GameHotbar } from "./game-hotbar";

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
      className={`fixed inset-0 w-screen h-screen z-[50] pointer-events-none ${
        hidden ? "hidden" : ""
      }`}
    >
      <GameChat />

      <GameToolbar />
      <GameHotbar />

      <GameInventory />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 rounded-lg text-white w-[400px] flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 ">
        <SkillBar />

        {/* HP Bar */}
        <div className="py-[1px] relative flex items-center justify-center w-full">
          <div className="text-[10px] z-50">
            {playerData.hp} / {playerData.maxHp}
          </div>
          <div className="absolute w-full h-[15px] bg-red-700 rounded">
            <div
              className="absolute h-full bg-red-500 rounded"
              style={{ width: `${(playerData.hp / playerData.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Top Right - Player Coordinates */}
      <div className="absolute top-4 right-4 p-3 rounded-lg text-white bg-gray-900 bg-opacity-80">
        <div className="text-sm">X: {playerData.x.toFixed(2)}</div>
        <div className="text-sm">Y: {playerData.y.toFixed(2)}</div>
        <div className="text-sm">Z: {playerData.z.toFixed(2)}</div>
      </div>
    </div>
  );
};
