import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { eventBus } from "@/game/eventBus/eventBus";

declare global {
  interface Window {
    chatActive: boolean;
  }
}

interface Message {
  id: number;
  sender: string;
  text: string;
  channel?: string; // e.g., "Guild", "Zone", etc.
}

export const GameChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "PlayerOne", text: "Hey everyone!", channel: "Zone" },
    { id: 2, sender: "MageZilla", text: "Dungeon time?", channel: "Guild" },
  ]);

  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

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

    const newMessage: Message = {
      id: Date.now(),
      sender: "You",
      text: input.trim(),
      channel: "Say",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    inputRef.current?.blur();
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsAtBottom(atBottom);
  };

  return (
    <div
      className={clsx(
        `absolute bottom-16 left-4 w-80 max-h-[40%] flex flex-col rounded-lg overflow-hidden shadow-lg border 
        text-sm transition-all duration-150 pointer-events-auto backdrop-blur-sm`,
        isActive ? "bg-background/80" : "bg-background/60"
      )}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      ref={chatRef}
    >
      {/* Message log */}
      <div
        className="flex-1 p-2 overflow-y-auto space-y-1 text-white"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="text-gray-300">
            [{msg.channel}] <span className="text-white">{msg.sender}:</span>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      {isActive && (
        <div
          className="fixed w-screen h-screen left-0 top-0"
          onClick={() => inputRef.current?.blur()}
        />
      )}

      {/* Input */}
      <form
        className="border-t border-gray-700 px-2 py-1 bg-background/90"
        onSubmit={handleSend}
      >
        <input
          type="text"
          ref={inputRef}
          className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onFocus={() => {
            setIsActive(true);
            window.chatActive = true;
          }}
          onBlur={() => {
            setIsActive(false);
            window.chatActive = false;
          }}
          onKeyDown={(e) => {
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
  );
};
