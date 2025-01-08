import { useEffect } from "react";
import { config } from "../scenes/config";
import { useNavigate } from "react-router-dom";

import * as Colyseus from "colyseus.js";
import { Game } from "@/scenes/game";

export const GamePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const client = new Colyseus.Client("ws://localhost:3000");

    const token = localStorage.getItem("colyseus-auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    new Game(config, client);
  }, [navigate]);

  return <div id="phaser-game" className="w-full" />;
};
