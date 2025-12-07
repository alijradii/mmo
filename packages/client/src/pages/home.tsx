import { Button } from "@/components/ui/button";
import { fetchUserDataAtom, userDataAtom } from "@/state/userAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [userData] = useAtom(userDataAtom);
    const [, fetchUser] = useAtom(fetchUserDataAtom);

    useEffect(() => {
        const token = localStorage.getItem("colyseus-auth-token");
        if (token) {
            fetchUser(); // Fetch user data if token exists
        }
    }, [fetchUser]);

    const handleLogout = () => {
        localStorage.removeItem("colyseus-auth-token");
        navigate("/login");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const isLoggedIn = !!localStorage.getItem("colyseus-auth-token");

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans dark">
            {/* Main content */}
            <div className="relative z-20 w-full h-full flex flex-col text-white">
                {/* Header */}
                <header className="w-full px-6 py-4 border-b border-white flex items-center justify-between bg-black/30">
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative w-[70px] h-[70px] flex items-center justify-center">
                            <img src="/images/guild forge transparent.png" />
                        </div>
                        <h1
                            className="text-4xl tracking-widest font-bold"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Guild Forge
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoggedIn && userData?.username ? (
                            <>
                                <span className="text-md font-medium">
                                    Welcome, <strong>{userData.username}</strong>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Button
                                onClick={handleLogin}
                                className="px-6 py-6 text-md font-orbitron font-bold text-white rounded-lg transition bg-primary border"
                            >
                                Log In
                            </Button>
                        )}
                    </div>
                </header>
            </div>
        </div>
    );
};
