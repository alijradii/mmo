import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Maximize2, X } from "lucide-react";

interface FullscreenPromptProps {
  isMobile: boolean;
}

export const FullscreenPrompt: React.FC<FullscreenPromptProps> = ({ isMobile }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    // Check if already in fullscreen
    const checkFullscreen = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Show prompt if not in fullscreen
      if (!isCurrentlyFullscreen) {
        // Show prompt after a short delay
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    checkFullscreen();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, [isMobile]);

  const requestFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }

      // Request landscape orientation lock after fullscreen
      if ((screen.orientation as any)?.lock) {
        try {
          await (screen.orientation as any).lock("landscape");
        } catch (err) {
          console.log("Orientation lock failed:", err);
        }
      } else if ((screen as any).lockOrientation) {
        try {
          (screen as any).lockOrientation("landscape");
        } catch (err) {
          console.log("Orientation lock failed:", err);
        }
      }

      setShowPrompt(false);
    } catch (err) {
      console.log("Fullscreen request failed:", err);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  if (!isMobile || !showPrompt || isFullscreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <Card className="w-[90%] max-w-md shadow-2xl border-2 border-white/20">
        <CardContent className="p-6 relative bg-gray-900 text-white">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={dismissPrompt}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex flex-col items-center gap-4 mt-2">
            <Maximize2 className="w-16 h-16 text-blue-400" />
            
            <h2 className="text-xl font-bold text-center">
              Play in Fullscreen
            </h2>
            
            <p className="text-sm text-center text-gray-300">
              For the best mobile experience, we recommend playing in fullscreen landscape mode.
            </p>

            <Button
              onClick={requestFullscreen}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
            >
              <Maximize2 className="w-5 h-5 mr-2" />
              Enter Fullscreen
            </Button>

            <button
              onClick={dismissPrompt}
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Continue without fullscreen
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

