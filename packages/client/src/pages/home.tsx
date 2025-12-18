import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleLogin = () => {
        navigate("/login");
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => {
            setIsVideoLoaded(true);
        };

        const handleLoadedData = () => {
            setIsVideoLoaded(true);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadeddata', handleLoadedData);

        // If video is already loaded
        if (video.readyState >= 3) {
            setIsVideoLoaded(true);
        }

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('loadeddata', handleLoadedData);
        };
    }, []);

    return (
        <div className="relative w-screen min-h-screen overflow-hidden font-sans">
            {/* Loading Screen */}
            {!isVideoLoaded && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-center space-y-6">
                        <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                            <div 
                                className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                                style={{ borderTopColor: '#facc15' }}
                            ></div>
                        </div>
                        <h2
                            className="text-3xl font-bold text-white"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Loading Guild Forge...
                        </h2>
                        <p className="text-yellow-400">Preparing your adventure</p>
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
                    className="w-full h-full object-cover"
                    style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
                >
                    <source src="/preview.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full min-h-screen flex flex-col text-white">
                {/* Header */}
                <header className="w-full px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative w-[70px] h-[70px] flex items-center justify-center">
                            <img 
                                src="/images/guild forge transparent.png" 
                                alt="Guild Forge Logo"
                                className="w-full h-full object-contain"
                            />
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
                    <Button
                        onClick={handleLogin}
                        className="px-6 py-6 text-md font-bold text-white rounded-lg transition bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border border-yellow-400/50 shadow-lg"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                        }}
                    >
                        Login with Discord
                    </Button>
                </header>

                {/* Hero Section */}
                <section className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2
                            className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Welcome to Guild Forge
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-200 mb-8">
                            A 2D MMO Adventure Built with Colyseus
                        </p>
                        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                            Experience an immersive multiplayer world where strategy meets adventure. 
                            Currently in <span className="font-bold text-yellow-400">Closed Beta</span> - 
                            Join the exclusive community and shape the future of Guild Forge.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={handleLogin}
                                size="lg"
                                className="px-8 py-6 text-xl font-bold text-white rounded-lg transition bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border border-yellow-400/50 shadow-xl hover:scale-105 transform"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                }}
                            >
                                Join Closed Beta
                            </Button>
                        </div>
                    </div>
                </section>

                {/* YouTube Video Section */}
                <section className="w-full py-16 px-4 bg-black/40 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <h3
                            className="text-3xl md:text-4xl font-bold text-center mb-8"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Watch the Trailer
                        </h3>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl border-2 border-yellow-500/50"
                                src="https://www.youtube.com/embed/pwFml6R7h_E?si=06epd0QzLJ6SU8_s&controls=0"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h3
                            className="text-3xl md:text-4xl font-bold text-center mb-12"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            What Awaits You
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition">
                                <h4 className="text-xl font-bold mb-3 text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                    Real-Time Multiplayer
                                </h4>
                                <p className="text-gray-300">
                                    Powered by Colyseus, experience seamless real-time gameplay with players from around the world.
                                </p>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition">
                                <h4 className="text-xl font-bold mb-3 text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                    2D Adventure
                                </h4>
                                <p className="text-gray-300">
                                    Explore a beautifully crafted 2D world filled with quests, battles, and endless possibilities.
                                </p>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition">
                                <h4 className="text-xl font-bold mb-3 text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                    Exclusive Beta Access
                                </h4>
                                <p className="text-gray-300">
                                    Join the closed beta community and help shape the future of Guild Forge with your feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="w-full py-16 px-4 bg-black/60 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3
                            className="text-3xl md:text-4xl font-bold mb-6"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Ready to Begin Your Journey?
                        </h3>
                        <p className="text-lg text-gray-300 mb-8">
                            Login with Discord to access the closed beta and start your adventure today.
                        </p>
                        <Button
                            onClick={handleLogin}
                            size="lg"
                            className="px-8 py-6 text-xl font-bold text-white rounded-lg transition bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border border-yellow-400/50 shadow-xl hover:scale-105 transform"
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                            }}
                        >
                            Get Started
                        </Button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full py-6 px-4 bg-black/80 backdrop-blur-sm text-center text-gray-400">
                    <p>© 2024 Guild Forge. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};
