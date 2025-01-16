import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { LoginPage } from "./pages/login";
import { GamePage } from "./pages/game";

const App: React.FC = () => {
  return <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<GamePage />} />
    </Routes>
  </Router>
}

export default App
