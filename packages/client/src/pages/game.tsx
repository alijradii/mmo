import { useEffect } from "react"
import { config } from "../scenes/config"

export const GamePage: React.FC = () => {
    useEffect(() => {
        new Phaser.Game(config)
    }, [])
    return <div id="phaser-game" />;
}