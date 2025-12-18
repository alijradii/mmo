import { useEffect, useRef } from "react";
import { config } from "../game/config";
import { useNavigate } from "react-router-dom";
import * as Colyseus from "colyseus.js";
import { GameModel } from "@/game/models/gameModel";
import { IRefPhaserGame, PhaserGame } from "../components/phaser-game";
import { GameUI } from "@/components/game-ui";

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
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

  useEffect(() => {
    // Handle fullscreen and orientation for mobile
    if (isMobileDevice()) {
      const requestFullscreen = async () => {
        try {
          // Request fullscreen
          const element = document.documentElement;
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            // Safari
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).msRequestFullscreen) {
            // IE/Edge
            await (element as any).msRequestFullscreen();
          }

          // Request landscape orientation lock (requires user gesture, so we try it)
          if ((screen.orientation as any)?.lock) {
            try {
              await (screen.orientation as any).lock("landscape");
            } catch (err) {
              console.log("Orientation lock not supported or requires user gesture:", err);
            }
          } else if ((screen as any).lockOrientation) {
            // Legacy API
            try {
              (screen as any).lockOrientation("landscape");
            } catch (err) {
              console.log("Orientation lock not supported:", err);
            }
          }
        } catch (err) {
          console.log("Fullscreen request failed:", err);
        }
      };

      // Try to request fullscreen after a short delay to ensure page is loaded
      const timer = setTimeout(() => {
        requestFullscreen();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force landscape if in portrait on mobile
      if (isMobileDevice() && window.innerHeight > window.innerWidth) {
        // Can't programmatically rotate, but we can show a message or handle UI
        console.log("Please rotate your device to landscape mode");
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const currentScene = (scene: Phaser.Scene) => {
    if (!scene) return;
  };

  return (
    <div className="relative bg-transparent overflow-y-hidden">
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
