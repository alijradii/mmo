import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import * as Colyseus from "colyseus.js";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        localStorage.removeItem("colyseus-auth-token");
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => {
            setIsVideoLoaded(true);
        };

        const handleLoadedData = () => {
            setIsVideoLoaded(true);
        };

        const handleError = () => {
            console.error("Video failed to load");
            setIsVideoLoaded(true); // Show content even if video fails
        };

        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);

        // If video is already loaded
        if (video.readyState >= 3) {
            setIsVideoLoaded(true);
        }

        // Timeout fallback - show content after 3 seconds regardless
        const timeoutId = setTimeout(() => {
            if (!isVideoLoaded) {
                console.warn("Video loading timeout - showing content anyway");
                setIsVideoLoaded(true);
            }
        }, 3000);

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
            clearTimeout(timeoutId);
        };
    }, [isVideoLoaded]);

    const handleLogin = () => {
        const url = import.meta.env.VITE_SERVER_URL;
        // || "ws://localhost:4070";

        console.log(url);
        const client = new Colyseus.Client(url);
        // const client = new Colyseus.Client(
        //   import.meta.env.VITE_SERVER_URL || "ws://localhost:4070"
        // );

        client.auth.signInWithProvider("discord").then(() => {
            if (client.auth.token) {
                navigate("/builder");
            }
        });
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans">
            {/* Loading Screen */}
            {!isVideoLoaded && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-center space-y-4 md:space-y-6">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                                style={{ borderTopColor: "#facc15" }}
                            ></div>
                        </div>
                        <h2
                            className="text-2xl md:text-3xl font-bold text-white"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Loading...
                        </h2>
                        <p className="text-sm md:text-base text-yellow-400">Preparing your adventure</p>
                    </div>
                </div>
            )}

            {/* Video Background */}
            <div className="fixed inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    style={{ opacity: isVideoLoaded ? 1 : 0, transition: "opacity 0.5s ease-in" }}
                >
                    <source src="/preview.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4 py-4">
                <div className="w-full max-w-md flex flex-col items-center p-6 md:p-8 backdrop-blur-md bg-black/40 border-2 border-yellow-500/30 rounded-2xl shadow-2xl gap-6 md:gap-8">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                            <img
                                src="/images/guild forge transparent.png"
                                alt="Guild Forge Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h1
                            className="text-2xl md:text-4xl tracking-wide md:tracking-widest font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            GuildForge
                        </h1>
                        <p className="text-gray-300 text-center text-xs md:text-sm px-2">
                            Join the closed beta and start your adventure
                        </p>
                    </div>

                    {/* Login Button */}
                    <Button
                        onClick={handleLogin}
                        className="w-full px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-bold text-white rounded-lg transition bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border border-yellow-400/50 shadow-xl hover:scale-105 transform"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                        }}
                    >
                        Login With Discord
                    </Button>
                </div>
            </div>
        </div>
    );
};
