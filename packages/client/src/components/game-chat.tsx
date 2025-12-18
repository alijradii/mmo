import { eventBus } from "@/game/eventBus/eventBus";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        chatActive: boolean;
    }
}

export interface ChatMessage {
    sender: string;
    content: string;
    type: "system" | "player" | "npc";
}

export const GameChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [input, setInput] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [visible, setVisible] = useState(true);
    const isMobile = useIsMobile();

    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([]);
    const [showRecentMessages, setShowRecentMessages] = useState(false);
    const recentMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (shouldShow: boolean) => {
            setVisible(shouldShow);

            // Clear unread messages when chat is opened on mobile
            if (shouldShow && isMobile) {
                setRecentMessages([]);
                setShowRecentMessages(false);
                eventBus.emit("chat-read");
            }

            // If chat is closed, ensure active state is reset
            if (!shouldShow) {
                setIsActive(false);
                window.chatActive = false;
                eventBus.emit("chat-active-changed", false);
            }
        };

        eventBus.on("toggle-chat-visibility", handler);

        return () => {
            eventBus.off("toggle-chat-visibility", handler);
        };
    }, [isMobile]);

    useEffect(() => {
        const handler = (message: ChatMessage) => {
            setMessages(prevMessages => [...prevMessages, message]);

            // Show new message notification on mobile when chat is hidden
            if (isMobile && !visible) {
                setRecentMessages(prev => {
                    const newMessages = [...prev, message];
                    // Keep only the last 3 messages
                    return newMessages.slice(-3);
                });
                setShowRecentMessages(true);

                // Emit unread notification
                eventBus.emit("chat-unread-message");

                // Clear previous timer
                if (recentMessageTimerRef.current) {
                    clearTimeout(recentMessageTimerRef.current);
                }

                // Hide after 5 seconds
                recentMessageTimerRef.current = setTimeout(() => {
                    setShowRecentMessages(false);
                }, 5000);
            }
        };

        eventBus.on("chat", handler);

        return () => {
            eventBus.off("chat", handler);
            if (recentMessageTimerRef.current) {
                clearTimeout(recentMessageTimerRef.current);
            }
        };
    }, [isMobile, visible]);

    useEffect(() => {
        eventBus.on("keypressed", (key: string) => {
            if (key === "enter") {
                inputRef.current?.focus();
            }
        });

        if (isAtBottom && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAtBottom]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input.trim();
        eventBus.emit("chat-send", { content });

        setInput("");
        inputRef.current?.blur();
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
        setIsAtBottom(atBottom);
    };

    // Recent messages overlay for mobile (shown when chat is hidden)
    const recentMessagesOverlay = isMobile && !visible && showRecentMessages && recentMessages.length > 0 && (
        <div className="fixed bottom-20 left-44 right-4 pointer-events-none z-40 flex flex-col gap-1">
            {recentMessages.map((msg, index) => (
                <div
                    key={index}
                    className="bg-background/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-xs text-white shadow-lg animate-in slide-in-from-bottom-2"
                >
                    <span className="font-semibold text-blue-400">[{msg.sender}]</span>: {msg.content}
                </div>
            ))}
        </div>
    );

    if (!visible) {
        return recentMessagesOverlay;
    }

    return (
        <>
            {recentMessagesOverlay}
            <div
                className={clsx(
                    `absolute flex flex-col rounded-lg shadow-lg border 
          transition-all duration-150 pointer-events-auto backdrop-blur-sm`,
                    isMobile
                        ? "bottom-20 left-40 right-4 text-xs min-h-[70vh] z-[999]"
                        : "bottom-16 left-4 w-80 text-sm",
                    isActive ? "bg-background/90" : "bg-background/70",
                    "overflow-hidden"
                )}
                style={isMobile ? { maxHeight: "calc(50vh - 80px)", height: "auto" } : { maxHeight: "40%" }}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                ref={chatRef}
            >
                {/* Close button for mobile */}
                {isMobile && (
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/20 bg-background/90 flex-shrink-0">
                        <span className="text-white font-semibold text-sm">Chat</span>
                        <button
                            onClick={() => {
                                eventBus.emit("toggle-chat-visibility", false);
                            }}
                            className="text-white hover:text-gray-300 text-lg"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Message log */}
                <div
                    className={clsx("flex-1 overflow-y-auto space-y-1 text-white min-h-0", isMobile ? "p-2" : "p-2")}
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    {messages.map((msg, index) => (
                        <div key={index} className="text-gray-300 break-words">
                            <span className="font-semibold text-blue-400">[{msg.sender}]</span>: {msg.content}
                        </div>
                    ))}
                </div>

                {isActive && (
                    <div
                        className="fixed w-screen h-screen left-0 top-0 -z-10"
                        onClick={() => inputRef.current?.blur()}
                    />
                )}

                {/* Input */}
                <form
                    className={clsx(
                        "border-t border-gray-700 bg-background/90 flex-shrink-0",
                        isMobile ? "px-3 py-2" : "px-2 py-1"
                    )}
                    onSubmit={handleSend}
                >
                    <input
                        type="text"
                        ref={inputRef}
                        className={clsx(
                            "w-full text-white placeholder-gray-400 outline-none",
                            isMobile
                                ? "text-base py-2.5 min-h-[44px] bg-black/40 border border-white/30 rounded px-3 focus:border-yellow-400/50 focus:bg-black/60"
                                : "text-sm bg-transparent",
                            "focus:outline-none transition-colors"
                        )}
                        placeholder="Type a message..."
                        value={input}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setIsActive(true);
                            window.chatActive = true;
                            eventBus.emit("chat-active-changed", true);
                        }}
                        onBlur={() => {
                            setIsActive(false);
                            window.chatActive = false;
                            eventBus.emit("chat-active-changed", false);
                        }}
                        onKeyDown={e => {
                            if (e.key === "Enter" && input.trim() === "") {
                                inputRef.current?.blur();
                                setIsActive(false);
                                window.chatActive = false;
                            }
                            e.stopPropagation();
                        }}
                    />
                </form>
            </div>
        </>
    );
};
