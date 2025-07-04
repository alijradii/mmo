import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userDataAtom, fetchUserDataAtom } from "@/state/userAtom";

// Include this in your main HTML or Tailwind config for fonts
// <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData] = useAtom(userDataAtom);
  const [, fetchUser] = useAtom(fetchUserDataAtom);

  useEffect(() => {
    const token = localStorage.getItem("colyseus-auth-token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUser(); // Fetch user data on mount
    }
  }, [navigate, fetchUser]);

  const handleLogout = () => {
    localStorage.removeItem("colyseus-auth-token");
    navigate("/login");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/game_background.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-10" />

      {/* Main content */}
      <div className="relative z-20 w-full h-full flex flex-col text-white">
        {/* Header */}
        <header className="w-full px-6 py-4 border-b border-white flex items-center justify-between bg-black/30">
          <h1
            className="text-4xl tracking-widest font-bold"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
            }}
          >
            Next Gen NPCs
          </h1>
          <div className="flex items-center gap-4">
            {userData?.username && (
              <span className="text-md font-medium">
                Welcome, <strong>{userData.username}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Central Buttons */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-6 px-4">
          <Link
            to="/builder"
            className="w-full max-w-xs text-center text-xl px-6 py-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-xl transition transform hover:scale-105 border border-blue-300"
          >
            Character Builder
          </Link>
          <Link
            to="/game"
            className="w-full max-w-xs text-center text-xl px-6 py-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-xl transition transform hover:scale-105 border border-green-300"
          >
            Enter the Game
          </Link>
        </div>
      </div>
    </div>
  );
};
