import { eventBus } from "@/game/eventBus/eventBus";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface JoystickPosition {
    x: number;
    y: number;
}

export const MobileJoystick: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const joystickRef = useRef<HTMLDivElement>(null);
    const activeTouchIdRef = useRef<number | null>(null);
    const radiusRef = useRef(60);
    const centerRef = useRef<JoystickPosition>({ x: 0, y: 0 });
    const [_, setIsActive] = useState(false);
    const [position, setPosition] = useState<JoystickPosition>({ x: 0, y: 0 });

    const updateMovement = useCallback((x: number, y: number) => {
        const normalizedX = Math.max(-1, Math.min(1, x / radiusRef.current));
        const normalizedY = Math.max(-1, Math.min(1, y / radiusRef.current));

        // Emit movement direction as normalized values
        eventBus.emit("mobile-movement", {
            x: normalizedX,
            y: normalizedY,
            active: true,
        });
    }, []);

    const resetJoystick = useCallback(() => {
        setPosition({ x: 0, y: 0 });
        setIsActive(false);
        eventBus.emit("mobile-movement", {
            x: 0,
            y: 0,
            active: false,
        });
    }, []);

    // Initialize position on mount and on window resize
    useEffect(() => {
        const updateJoystickPosition = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            centerRef.current = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            radiusRef.current = rect.width / 2 - 20;
        };

        updateJoystickPosition();

        // Update on window resize or orientation change
        window.addEventListener("resize", updateJoystickPosition);
        window.addEventListener("orientationchange", updateJoystickPosition);

        return () => {
            window.removeEventListener("resize", updateJoystickPosition);
            window.removeEventListener("orientationchange", updateJoystickPosition);
        };
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            // Check if touch is within joystick area
            const distance = Math.sqrt(
                Math.pow(touchX - centerRef.current.x, 2) + Math.pow(touchY - centerRef.current.y, 2)
            );

            if (distance <= radiusRef.current + 30) {
                e.preventDefault();
                e.stopPropagation();
                activeTouchIdRef.current = touch.identifier;
                setIsActive(true);
                updateJoystickPosition(touchX, touchY);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (activeTouchIdRef.current === null) return;

            // Find the touch that matches our active touch ID
            const touch = Array.from(e.touches).find(t => t.identifier === activeTouchIdRef.current!);
            if (!touch) return;

            const touchX = touch.clientX;
            const touchY = touch.clientY;
            const distanceFromCenter = Math.sqrt(
                Math.pow(touchX - centerRef.current.x, 2) + Math.pow(touchY - centerRef.current.y, 2)
            );

            // Only handle if still reasonably close to joystick area
            if (distanceFromCenter <= radiusRef.current + 50) {
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
            if (activeTouchIdRef.current === null) return;

            const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchIdRef.current!);
            if (touch) {
                e.preventDefault();
                e.stopPropagation();
                resetJoystick();
                activeTouchIdRef.current = null;
            }
        };

        const handleTouchCancel = (e: TouchEvent) => {
            if (activeTouchIdRef.current === null) return;

            const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchIdRef.current!);
            if (touch) {
                e.preventDefault();
                e.stopPropagation();
                resetJoystick();
                activeTouchIdRef.current = null;
            }
        };

        const updateJoystickPosition = (touchX: number, touchY: number) => {
            const deltaX = touchX - centerRef.current.x;
            const deltaY = touchY - centerRef.current.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            let newX = deltaX;
            let newY = deltaY;

            if (distance > radiusRef.current) {
                // Clamp to circle boundary
                newX = (deltaX / distance) * radiusRef.current;
                newY = (deltaY / distance) * radiusRef.current;
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
    }, [updateMovement, resetJoystick]);

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
