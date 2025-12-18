import { FullscreenPrompt } from "@/components/fullscreen-prompt";
import { GameUI } from "@/components/game-ui";
import { GameModel } from "@/game/models/gameModel";
import * as Colyseus from "colyseus.js";
import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IRefPhaserGame, PhaserGame } from "../components/phaser-game";
import { config } from "../game/config";

const isMobileDevice = () => {
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
    );
};

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

    const isMobile = isMobileDevice();

    return (
        <div className="relative bg-transparent overflow-y-hidden">
            {clientRef.current && (
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} client={clientRef.current} />
            )}

            <GameUI />

            {/* Fullscreen prompt for mobile */}
            <FullscreenPrompt isMobile={isMobile} />
        </div>
    );
};
