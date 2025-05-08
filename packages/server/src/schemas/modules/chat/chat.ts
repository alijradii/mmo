export interface ChatMessage {
  sender: string;
  content: string;
  type: "system" | "player" | "npc";
}
