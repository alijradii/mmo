import { useEffect } from "react"
import { config } from "./scenes/config"

function App() {
  useEffect(() => {
    const game = new Phaser.Game(config)
    console.log(game)
  }, [])
  return <div id="phaser-game" />;
}

export default App
