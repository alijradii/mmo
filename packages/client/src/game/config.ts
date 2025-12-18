import * as Colyseus from "colyseus.js";
import { Types } from "phaser";
import { GameModel } from "./models/gameModel";
import { MainScene } from "./scenes/main";
import { PreloaderScene } from "./scenes/preloader";

export const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    pixelArt: true,
    physics: {
        default: "arcade",
    },
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    antialias: false,
    autoRound: true,
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scene: [PreloaderScene, MainScene],
};

const startGame = (parent: string, client: Colyseus.Client) => {
    const game = new GameModel({ ...config, parent }, client);

    // Setup automatic resizing
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (game && game.scale) {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                console.log(`Resizing game to ${newWidth}x${newHeight}`);

                // Update the game scale
                game.scale.resize(newWidth, newHeight);

                // Force refresh the scale manager
                game.scale.refresh();

                // Update camera zoom if main scene is active
                setTimeout(() => {
                    if (game.scene.scenes.length > 0) {
                        const mainScene = game.scene.scenes.find(scene => scene.scene.key === "main") as any;
                        if (mainScene?.cameras?.main) {
                            const isMobile = newWidth < 768;
                            mainScene.cameras.main.setZoom(isMobile ? 3 : 4);
                            console.log(`Updated camera zoom to ${isMobile ? 3 : 4}`);
                        }
                    }
                }, 50);
            }
        }, 150);
    };

    const handleOrientationChange = () => {
        setTimeout(() => {
            handleResize();
        }, 200);
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("fullscreenchange", handleResize);
    document.addEventListener("webkitfullscreenchange", handleResize);
    document.addEventListener("msfullscreenchange", handleResize);

    return game;
};

export default startGame;
