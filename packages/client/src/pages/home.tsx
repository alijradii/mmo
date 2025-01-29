import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <Link to={"/generator"}>Edit Appearance</Link>
        <Link to={"/game"}>Enter the game</Link>
      </div>
    </div>
  );
};
