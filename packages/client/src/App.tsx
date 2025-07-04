import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { GamePage } from "./pages/game";
import { HomePage } from "./pages/home";
import { Toaster } from "@/components/ui/toaster";
import { BuilderPage } from "./pages/builder";
import DashboardPage from "./pages/dashboard";
import { Provider } from "jotai";

const App: React.FC = () => {
  return (
    <Provider>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
