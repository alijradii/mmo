import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { eventBus } from "@/game/eventBus/eventBus";

interface MobileZoomControlProps {
  isMobile: boolean;
}

export const MobileZoomControl: React.FC<MobileZoomControlProps> = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3); // Default mobile zoom

  useEffect(() => {
    if (!isMobile) return;

    // Listen for zoom changes from other sources
    const handleZoomChange = (zoom: number) => {
      setZoomLevel(zoom);
    };

    eventBus.on("zoom-changed", handleZoomChange);

    return () => {
      eventBus.off("zoom-changed", handleZoomChange);
    };
  }, [isMobile]);

  const handleZoomChange = (value: number) => {
    setZoomLevel(value);
    eventBus.emit("set-zoom", value);
  };

  const incrementZoom = () => {
    const newZoom = Math.min(6, zoomLevel + 0.5);
    handleZoomChange(newZoom);
  };

  const decrementZoom = () => {
    const newZoom = Math.max(1, zoomLevel - 0.5);
    handleZoomChange(newZoom);
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant="secondary"
        className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm border-2 border-white/40 pointer-events-auto"
      >
        <ZoomIn className="h-5 w-5 text-white" />
      </Button>

      {/* Zoom Control Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <Card className="w-[90%] max-w-sm shadow-2xl border-2 border-white/20">
            <CardContent className="p-6 relative bg-gray-900 text-white">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex flex-col gap-6 mt-2">
                <h2 className="text-xl font-bold text-center">Zoom Level</h2>

                {/* Zoom Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">
                    {zoomLevel.toFixed(1)}x
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Current zoom</p>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={decrementZoom}
                    disabled={zoomLevel <= 1}
                    className="flex-shrink-0"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>

                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={zoomLevel}
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={incrementZoom}
                    disabled={zoomLevel >= 6}
                    className="flex-shrink-0"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Zoom Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={zoomLevel === 2 ? "default" : "outline"}
                    onClick={() => handleZoomChange(2)}
                    className="text-sm"
                  >
                    2x
                  </Button>
                  <Button
                    variant={zoomLevel === 3 ? "default" : "outline"}
                    onClick={() => handleZoomChange(3)}
                    className="text-sm"
                  >
                    3x
                  </Button>
                  <Button
                    variant={zoomLevel === 4 ? "default" : "outline"}
                    onClick={() => handleZoomChange(4)}
                    className="text-sm"
                  >
                    4x
                  </Button>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

