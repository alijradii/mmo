import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("colyseus-auth-token");
    if (token) {
    //   navigate("/game");
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate("/game");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>No Chess No Life</h1>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};