import { Button } from "@/components/ui/button";
import { useEffect } from "react";

import * as Colyseus from "colyseus.js";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("colyseus-auth-token");
  }, []);

  const handleLogin = () => {
    const url = import.meta.env.PROD
      ? "wss://nochessnolife.cc"
      : "ws://localhost:4070";
    const client = new Colyseus.Client(url);
    // const client = new Colyseus.Client(
    //   import.meta.env.VITE_SERVER_URL || "ws://localhost:4070"
    // );

    client.auth.signInWithProvider("discord").then(() => {
      if (client.auth.token) {
        navigate("/game");
      }
    });
  };

  return (
    <div className="w-screen h-screen relative flex flex-col justify-center items-center">
      <div className="absolute w-screen h-screen overflow-hidden">
        <img src="/images/ngnl_wallpaper_upscaled.jpg" />
      </div>

      <div className="absolute w-screen h-screen bg-background/95 z-0" />

      <div className="w-[400px] flex flex-col p-6 backdrop-blur-sm border-[1px] z-10 rounded-[20px] gap-[20px]">
        <h1 className="w-full text-center font-ngnl text-[28px]">
          NO CHESS NO LIFE MMO
        </h1>
        <Button
          onClick={handleLogin}
          variant="outline"
          className="hover:text-primary-foreground text-[20px] font-bold py-[24px]"
        >
          Login With Discord
        </Button>
      </div>
    </div>
  );
};
