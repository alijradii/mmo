import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userDataAtom, fetchUserDataAtom } from "@/state/userAtom";

export const MainPage: React.FC = () => {
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
        <header className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-white flex flex-col sm:flex-row items-center justify-between bg-black/30 gap-3 sm:gap-0">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="relative w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] lg:w-[70px] lg:h-[70px] flex items-center justify-center">
              <img 
                src="/images/guild forge transparent.png" 
                alt="Guild Forge Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1
              className="text-xl sm:text-2xl lg:text-4xl tracking-wide lg:tracking-widest font-bold"
              style={{
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Guild Forge
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            {userData?.username && (
              <span className="text-xs sm:text-sm lg:text-lg font-medium">
                Welcome, <strong className="text-yellow-400">{userData.username}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm lg:text-base font-semibold bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Central Buttons */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 sm:space-y-6 px-4">
          <Link
            to="/builder"
            className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md text-center text-base sm:text-xl lg:text-2xl px-4 py-3 sm:px-8 sm:py-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-xl transition transform hover:scale-105 border border-blue-300 font-bold"
            style={{
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            Character Builder
          </Link>
          <Link
            to="/game"
            className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md text-center text-base sm:text-xl lg:text-2xl px-4 py-3 sm:px-8 sm:py-4 rounded-lg bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-xl transition transform hover:scale-105 border border-green-300 font-bold"
            style={{
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            Enter the Game
          </Link>
        </div>
      </div>
    </div>
  );
};
