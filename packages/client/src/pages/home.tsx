import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("colyseus-auth-token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <Link to={"/builder"}>Character Builder</Link>
        <Link to={"/game"}>Enter the game</Link>
      </div>
    </div>
  );
};
