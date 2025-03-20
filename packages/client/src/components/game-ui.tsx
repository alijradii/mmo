import { EventBus } from "@/game/eventBus/eventBus";
import React, { useState } from "react";

export const GameUI: React.FC = () => {
  const [playerName, setPlayerName] = useState("");
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(120);
  const [mp, setMp] = useState(0);
  const [maxMp, setMaxMp] = useState(0);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left - Player Info */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg text-white w-60">
        <h2 className="text-lg font-bold">{playerName}</h2>

        {/* HP Bar */}
        <div className="mt-2">
          <div className="text-sm">
            HP: {hp} / {maxHp}
          </div>
          <div className="w-full h-4 bg-red-700 rounded">
            <div
              className="h-full bg-red-500 rounded"
              style={{ width: `${(hp / maxHp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* MP Bar */}
        <div className="mt-2">
          <div className="text-sm">
            MP: {mp} / {maxMp}
          </div>
          <div className="w-full h-4 bg-blue-700 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(mp / maxMp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Center - Skill Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-80 p-2 rounded-lg flex space-x-2"></div>
    </div>
  );
};
