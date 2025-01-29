import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { GamePage } from "./pages/game";
import { GeneratorPage } from "./pages/generator";
import { HomePage } from "./pages/home";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generator" element={<GeneratorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
