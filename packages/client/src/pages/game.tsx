import { useEffect } from "react";
import { config } from "../game/config";
import { useNavigate } from "react-router-dom";

import * as Colyseus from "colyseus.js";
import { GameModel } from "@/game/gameModel";

export const GamePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL || "ws://localhost:4070"
    console.log(url)
    const client = new Colyseus.Client(url);

    const token = localStorage.getItem("colyseus-auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    new GameModel(config, client);
  }, [navigate]);

  return <div id="phaser-game" className="w-full" />;
};
