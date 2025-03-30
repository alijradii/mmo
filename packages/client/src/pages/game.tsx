import { useEffect, useRef } from "react";
import { config } from "../game/config";
import { useNavigate } from "react-router-dom";
import * as Colyseus from "colyseus.js";
import { GameModel } from "@/game/models/gameModel";
import { IRefPhaserGame, PhaserGame } from "../components/phaser-game";
import { GameUI } from "@/components/game-ui";

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const clientRef = useRef<Colyseus.Client | null>(null);
  const gameModelRef = useRef<GameModel | null>(null);

  useEffect(() => {
    if (clientRef.current) return; // Prevent multiple instances

    const url = import.meta.env.VITE_SERVER_URL || "ws://localhost:4070";
    console.log(url);

    const client = new Colyseus.Client(url);
    clientRef.current = client;

    const token = localStorage.getItem("colyseus-auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!gameModelRef.current) {
      gameModelRef.current = new GameModel(config, client);
    }
  }, [navigate]);

  const currentScene = (scene: Phaser.Scene) => {
    if (!scene) return;
  };

  return (
    <div className="relative">
      {clientRef.current && (
        <PhaserGame
          ref={phaserRef}
          currentActiveScene={currentScene}
          client={clientRef.current}
        />
      )}

      <GameUI />
    </div>
  );
};
