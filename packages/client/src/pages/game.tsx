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
    // Handle screen resize and orientation changes - update Phaser game size
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events to avoid excessive calls
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Access the ref directly - refs are stable and don't cause re-renders
        const phaserGame = phaserRef.current;
        if (phaserGame?.game) {
          const game = phaserGame.game;
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          
          // Resize the Phaser game
          game.scale.resize(newWidth, newHeight);
          
          // Update camera zoom based on mobile detection after resize
          if (game.scene.scenes.length > 0) {
            const mainScene = game.scene.scenes.find(
              (scene) => scene.scene.key === "main"
            ) as any;
            if (mainScene?.cameras?.main) {
              const isMobile = newWidth < 768;
              mainScene.cameras.main.setZoom(isMobile ? 3 : 4);
            }
          }
        }
      }, 150);
    };

    // Handle orientation changes with a slight delay to ensure dimensions are updated
    const handleOrientationChange = () => {
      setTimeout(() => {
        handleResize();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Also listen for fullscreen changes
    document.addEventListener("fullscreenchange", handleResize);
    document.addEventListener("webkitfullscreenchange", handleResize);
    document.addEventListener("msfullscreenchange", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("fullscreenchange", handleResize);
      document.removeEventListener("webkitfullscreenchange", handleResize);
      document.removeEventListener("msfullscreenchange", handleResize);
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
