import React, { useRef, useEffect, useState, useCallback } from "react";
import { eventBus } from "@/game/eventBus/eventBus";

interface JoystickPosition {
  x: number;
  y: number;
}

export const MobileJoystick: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [center, setCenter] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [radius, setRadius] = useState(60);

  const updateMovement = useCallback((x: number, y: number) => {
    const normalizedX = Math.max(-1, Math.min(1, x / radius));
    const normalizedY = Math.max(-1, Math.min(1, y / radius));
    
    // Emit movement direction as normalized values
    eventBus.emit("mobile-movement", {
      x: normalizedX,
      y: normalizedY,
      active: true,
    });
  }, [radius]);

  const resetJoystick = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsActive(false);
    eventBus.emit("mobile-movement", {
      x: 0,
      y: 0,
      active: false,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setCenter({ x: centerX, y: centerY });
    setRadius(rect.width / 2 - 20);

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      // Check if touch is within joystick area
      const distance = Math.sqrt(
        Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
      );
      
      if (distance <= radius + 30) {
        e.preventDefault();
        e.stopPropagation();
        activeTouchIdRef.current = touch.identifier;
        setIsActive(true);
        updateJoystickPosition(touchX, touchY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || activeTouchIdRef.current === null) return;
      
      // Find the touch that matches our active touch ID
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouchIdRef.current!);
      if (!touch) return;
      
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      const distanceFromCenter = Math.sqrt(
        Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
      );
      
      // Only handle if still reasonably close to joystick area
      if (distanceFromCenter <= radius + 50) {
        e.preventDefault();
        e.stopPropagation();
        updateJoystickPosition(touchX, touchY);
      } else {
        // Touch moved too far away, reset joystick
        resetJoystick();
        activeTouchIdRef.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isActive || activeTouchIdRef.current === null) return;
      
      const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchIdRef.current!);
      if (touch) {
        e.preventDefault();
        e.stopPropagation();
        resetJoystick();
        activeTouchIdRef.current = null;
      }
    };

    const handleTouchCancel = (e: TouchEvent) => {
      if (!isActive || activeTouchIdRef.current === null) return;
      
      const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchIdRef.current!);
      if (touch) {
        e.preventDefault();
        e.stopPropagation();
        resetJoystick();
        activeTouchIdRef.current = null;
      }
    };

    const updateJoystickPosition = (touchX: number, touchY: number) => {
      const deltaX = touchX - centerX;
      const deltaY = touchY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let newX = deltaX;
      let newY = deltaY;

      if (distance > radius) {
        // Clamp to circle boundary
        newX = (deltaX / distance) * radius;
        newY = (deltaY / distance) * radius;
      }

      setPosition({ x: newX, y: newY });
      updateMovement(newX, newY);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isActive, center, radius, updateMovement, resetJoystick]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 left-6 w-32 h-32 pointer-events-auto touch-none z-50 flex items-center justify-center"
    >
      {/* Outer circle */}
      <div className="absolute inset-0 rounded-full bg-white/20 border-2 border-white/40 backdrop-blur-sm" />
      
      {/* Inner joystick */}
      <div
        ref={joystickRef}
        className="relative w-14 h-14 rounded-full bg-white/60 border-2 border-white/80 backdrop-blur-sm transition-transform duration-75"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </div>
  );
};

